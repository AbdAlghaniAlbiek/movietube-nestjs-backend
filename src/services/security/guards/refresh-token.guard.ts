import { Injectable } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common/interfaces';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';
import {
	InternalServerErrorException,
	UnauthorizedException
} from '@nestjs/common/exceptions';
import { AuthResultMessages } from 'src/helpers/constants/result-messages.constants';
import { AESCryptography } from '../cryptography/aes.crypto';
import { Strategies } from 'src/helpers/constants/strategies-specifics.constants';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/data/schemas/user.schema';
import { Model } from 'mongoose';
import { documentToClass } from 'src/helpers/resolvers/document-parser.resolver';

@Injectable()
export class RefreshTokenAuthGuard extends AuthGuard(Strategies.RefreshToken) {
	constructor(
		private aesService: AESCryptography,
		@InjectModel(User.name) private userModel: Model<UserDocument>
	) {
		super();
	}

	canActivate(context: ExecutionContext) {
		const req = context.switchToHttp().getRequest();
		if (req.user.isAuth) return true;

		this.userModel
			.findById(req.user['sub'])
			.then((data) => {
				req.headers['Authorization'] = this.aesService.decryption(
					(documentToClass(data, User) as User).refreshToken
				);
				return super.canActivate(context);
			})
			.catch((err) => {
				throw new InternalServerErrorException(`${err}`);
			});
	}

	handleRequest(err, user, info: Error) {
		if (info instanceof TokenExpiredError) {
			throw new UnauthorizedException(AuthResultMessages.unauthorizedUser());
		}

		// For updating refreshToken in db in CompleteAuth middleware / Intreceptors
		user.requiredRefreshToken = true;

		return user;
	}
}
