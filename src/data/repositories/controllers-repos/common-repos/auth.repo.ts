import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import {
	AuthUserDto,
	CreateUserDto
} from 'src/data/dtos/common-dtos/requests/auth-request.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HashCryptography } from '../../../../services/security/cryptography/hash.crypto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/data/schemas/user.schema';
import { JwtConfig } from 'src/configurations/config.interfaces';
import {
	AuthResultMessages,
	CrudResultMessages
} from 'src/helpers/constants/result-messages.constants';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { CRUD } from 'src/helpers/constants/crud.contants';
import { AESCryptography } from '../../../../services/security/cryptography/aes.crypto';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { MailQueueProducer } from 'src/services/enhancers/queues/producers/mail.producer';
import { Model } from 'mongoose';
import { documentToClass } from 'src/helpers/resolvers/document-parser.resolver';

@Injectable()
export class AuthRepo {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		private jwtService: JwtService,
		private hashService: HashCryptography,
		private aesService: AESCryptography,
		private configService: ConfigService<JwtConfig>,
		private mailQueueProducer: MailQueueProducer,
		@InjectMapper() private readonly mapper: Mapper
	) {}

	async signUp(createUserDto: CreateUserDto): Promise<string> {
		try {
			// Check if person exists
			const userExists = await this.userModel.find({
				email: createUserDto.email
			});

			if (userExists) {
				throw new BadRequestException(
					AuthResultMessages.personAlreadyExist(createUserDto.email)
				);
			}

			// Make Hashed password for the user
			createUserDto.password = await this.hashData(createUserDto.password);

			/* 
				Important Note:
				Generating verify code will be in CreateUserDtoMapper in user profile (mapper folder)
			*/

			// Mapping from createPerons dto to User entity
			const user = await this.mapper.mapAsync(
				createUserDto,
				CreateUserDto,
				User
			);

			// Creating user in db
			const newUser = documentToClass(
				await this.userModel.create(user),
				User
			) as User;

			// generate specific tokens for this User
			const accessToken = await this.getAccessToken(newUser._id, newUser.name);
			const refreshToken = await this.getRefreshToken(
				newUser._id,
				`${newUser.name}`
			);

			await this.updateRefreshToken(newUser._id, refreshToken);

			await this.mailQueueProducer.sendMailVerification({
				to: newUser.email,
				subject: 'Confirmaion email from Herafi team',
				text: `We Herafi team sended this email to you for completion your verification process, last step is to copy this veriy code to ensure that your account is verified \n\nVerify code: ${user.verifyCode}`
			});
			return accessToken;
		} catch (err) {
			throw new InternalServerErrorException(
				CrudResultMessages.failedCRUD(
					`User with email ${createUserDto.email}`,
					CRUD.create,
					err.message
				)
			);
		}
	}

	async verifAccount(userId: number, verifyCode: string) {
		try {
			const user = this.userModel.findOne({
				_id: userId,
				verifyCode
			});
			if (!user) {
				throw new NotFoundException(
					CrudResultMessages.itemNotFound(`User with id: ${userId}`)
				);
			}

			await this.userModel.updateOne({ _id: userId }, { verifyCode: null });

			await this.userModel.updateOne({ _id: userId }, { verified: true });

			return CrudResultMessages.successCRUD(
				`User with id: ${userId}`,
				CRUD.Update,
				''
			);
		} catch (err) {
			throw new InternalServerErrorException(
				CrudResultMessages.failedCRUD(
					`User with id: ${userId}`,
					CRUD.Update,
					`${err}`
				)
			);
		}
	}

	async signIn(authUser: AuthUserDto): Promise<string> {
		try {
			// Check if user exists
			const user = await this.userModel.findOne({
				email: authUser.email
			});
			if (!user) {
				throw new BadRequestException(
					CrudResultMessages.itemNotFound(`User with email: ${authUser.email}`)
				);
			}

			/* Compare if the sended password from user is actually equally to his registered hashed password in db */
			const passwordMatches = this.verifyPlainAndHashedData(
				authUser.password,
				user.password
			);
			if (!passwordMatches) {
				throw new BadRequestException(
					AuthResultMessages.emailOrPasswordIsIncorrect()
				);
			}

			// generate specific tokens for this user
			const accessToken = await this.getAccessToken(user._id, `${user.name}`);
			const refreshToken = await this.getRefreshToken(user._id, `${user.name}`);

			await this.updateRefreshToken(user._id, refreshToken);
			return accessToken;
		} catch (err) {
			throw new InternalServerErrorException(
				CrudResultMessages.failedCRUD(
					`User with email: ${authUser.email}`,
					CRUD.Update,
					`${err}`
				)
			);
		}
	}

	async logout(userId: number): Promise<string> {
		try {
			const user = this.userModel.findOne({ _id: userId });
			if (!user) {
				throw new BadRequestException(
					CrudResultMessages.itemNotFound(`User with id: ${userId}`)
				);
			}
			await this.userModel.updateOne(
				{ _id: userId },
				{
					refreshToken: null
				}
			);

			return CrudResultMessages.successCRUD(
				`User with: ${userId}`,
				CRUD.Update,
				''
			);
		} catch (err) {
			throw new InternalServerErrorException(
				CrudResultMessages.failedCRUD(
					`User with id: ${userId}`,
					CRUD.Update,
					`${err}`
				)
			);
		}
	}

	async hashData(data: string): Promise<string> {
		try {
			return this.hashService.hashingPlainText(data);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	async verifyPlainAndHashedData(
		plainText: string,
		hashedText: string
	): Promise<boolean> {
		try {
			const passwordMatches = await this.hashService.comparePlainTextWithHash(
				plainText,
				hashedText
			);
			return passwordMatches;
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	async updateRefreshToken(userId: string, refreshToken: string) {
		try {
			const encryptedRefreshToken = await this.aesService.encryption(
				refreshToken
			);
			await this.userModel.updateOne(
				{ _id: userId },
				{
					refreshToken: encryptedRefreshToken
				}
			);

			return true;
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	async getAccessToken(userId: string, name: string) {
		try {
			return this.jwtService.signAsync(
				{
					sub: userId,
					name
				},
				{
					secret: this.configService.get('PUBLIC_KEY'),
					expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES_IN'),
					algorithm: this.configService.get('ALGORITHM'),
					issuer: this.configService.get('ISSUER'),
					audience: this.configService.get('AUDIENCE'),
					jwtid: this.configService.get('JWT_ID'),
					keyid: this.configService.get('KEY_ID'),
					noTimestamp: this.configService.get('NO_TIMESTAMP')
				}
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	async getRefreshToken(userId: string, name: string) {
		try {
			return this.jwtService.signAsync(
				{
					sub: userId,
					name
				},
				{
					secret: this.configService.get('PRIVATE_KEY'),
					expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
					algorithm: this.configService.get('ALGORITHM'),
					issuer: this.configService.get('ISSUER'),
					audience: this.configService.get('AUDIENCE'),
					jwtid: this.configService.get('JWT_ID'),
					keyid: this.configService.get('KEY_ID'),
					noTimestamp: this.configService.get('NO_TIMESTAMP')
				}
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}
}
