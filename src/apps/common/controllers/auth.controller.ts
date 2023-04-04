import { VERSION_NEUTRAL } from '@nestjs/common/interfaces';
import { Post, Body, Param, Query, HttpCode } from '@nestjs/common';
import { ApiController } from 'src/helpers/decorators/swagger.decorator';
import { AuthRepo } from 'src/data/repositories/controllers-repos/common-repos/auth.repo';
import { HttpStatus } from '@nestjs/common/enums';
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiCreatedResponse,
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiQuery
} from '@nestjs/swagger';
import {
	AuthUserDto,
	CreateUserDto
} from 'src/data/dtos/common-dtos/requests/auth-request.dto';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { Authenticated } from 'src/helpers/decorators/auth.decorator';
import { User } from 'src/data/schemas/user.schema';

@ApiController({ path: 'auth', version: VERSION_NEUTRAL })
export class AuthController {
	constructor(private readonly authRepo: AuthRepo) {}

	//#region swagger api config
	@ApiOperation({ summary: 'Registering a new user to db' })
	@ApiCreatedResponse({
		description: 'Successfuly regeration process for user',
		type: User
	})
	@ApiBadRequestResponse({
		description:
			'When Body not match validation rules || ' +
			'When person is already registered with same sended email'
	})
	@ApiInternalServerErrorResponse({
		description:
			'When Hashing, encrypting or decrypting data has failed || ' +
			'When Signing Access/Refresh tokens has failed || ' +
			'When Mapping has failed or Typeorm related error just occured'
	})
	@ApiBody({
		description: 'Person object that comes from clients applications',
		type: CreateUserDto,
		required: true,
		examples: {
			a: {
				summary: 'First example',
				description: 'createPersonDto object example',
				value: {
					email: 'abdolabaik190@gmail.com',
					password: 'BSEben123/*-',
					name: 'Abdulqader',
					imagePath: ''
				} as CreateUserDto
			}
		}
	})
	//#endregion
	@Post('sign-up')
	@HttpCode(HttpStatus.CREATED)
	public async SignUp(@Body() createPersonDto: CreateUserDto): Promise<string> {
		return this.authRepo.signUp(createPersonDto);
	}

	//#region swagger api confg
	@ApiOperation({
		summary:
			'Complete registeration process of user with verifying his verify code'
	})
	@ApiOkResponse({
		description: 'Successfuly completion user registeration in Movietube system'
	})
	@ApiBadRequestResponse({
		description:
			'When Params/Query not match validation rules || ' +
			'When person not found depending on his id'
	})
	@ApiInternalServerErrorResponse({
		description: 'When Typeorm related error just occured'
	})
	@ApiQuery({
		name: 'verify_code',
		description:
			"verify code is about like multiple numbers and it's unique in db",
		required: true,
		type: String
	})
	@ApiParam({
		name: 'userId',
		description: 'id of user that matched in db',
		type: Number,
		required: true
	})
	//#endregion
	@Authenticated()
	@Post('verify-account/:userId')
	@HttpCode(HttpStatus.OK)
	public async verifyAccount(
		@Param('userId', ParseIntPipe)
		userId: number,
		@Query('verify_code') verifyCode: string
	): Promise<string> {
		return this.authRepo.verifAccount(userId, verifyCode);
	}

	//#region swagger api config
	@ApiOperation({ summary: 'Enable user to sign in to Herafi system' })
	@ApiOkResponse({
		description: 'Person is signed in successfuly with this process'
	})
	@ApiBadRequestResponse({
		description:
			"When Body doesn't match validation rules || " +
			"When person not found depending on its id or verify code doesn't equal to verify_code field in db"
	})
	@ApiInternalServerErrorResponse({
		description: 'When Typeorm related error just occured'
	})
	@ApiBody({
		description: 'just person object with email and password',
		type: AuthUserDto,
		required: true,
		examples: {
			a: {
				summary: 'First object',
				description: 'AuthUser object example',
				value: {
					email: 'abdoalbaik190@gmail.com',
					password: 'BSEben123/*-'
				} as AuthUserDto
			}
		}
	})
	//#endregion
	@Post('sign-in')
	@HttpCode(HttpStatus.OK)
	public async SignIn(@Body() authDtoPerson: AuthUserDto): Promise<string> {
		return this.authRepo.signIn(authDtoPerson);
	}

	//#region swagger api config
	@ApiOperation({ summary: 'Logout user from Movietube system' })
	@ApiOkResponse({
		description: 'Person is loged out from Herafi system without any error'
	})
	@ApiBadRequestResponse({
		description:
			"When Params doesn't match specific rules || " +
			"When person not found beacause the sended id doesn't match person in db"
	})
	@ApiInternalServerErrorResponse({
		description: 'When Typeorm related error just occured'
	})
	@ApiParam({
		name: 'userId',
		description: 'user id in db',
		required: true,
		type: Number
	})
	//#endregion
	@Post('logout/:userId')
	@HttpCode(HttpStatus.OK)
	public logout(
		@Param('personId', ParseIntPipe)
		userId: number
	): Promise<string> {
		return this.authRepo.logout(userId);
	}
}
