import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
	createMap,
	forMember,
	fromValue,
	ignore,
	Mapper
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { User } from 'src/data/schemas/user.schema';
import {
	CreateUserDto,
	UpdateUserDto
} from 'src/data/dtos/common-dtos/requests/auth-request.dto';
import { ReadUserDto } from 'src/data/dtos/common-dtos/responses/auth-response.dto';
import { generateRandomVerificationCode } from 'src/helpers/resolvers/generate-random-values.resolver';

@Injectable()
export class UserProfile extends AutomapperProfile {
	constructor(@InjectMapper() mapper: Mapper) {
		super(mapper);
	}

	override get profile() {
		return (mapper) => {
			this.createUserDtoMap(mapper);
			this.updateUserDtoMap(mapper);
			this.readUserDtoMap(mapper);
		};
	}

	private createUserDtoMap(mapper: any) {
		createMap(
			mapper,
			CreateUserDto,
			User,
			forMember((dest) => dest._id, ignore()),
			forMember(
				(dest) => dest.verifyCode,
				fromValue(generateRandomVerificationCode())
			)
		);
	}

	private updateUserDtoMap(mapper: any) {
		createMap(
			mapper,
			UpdateUserDto,
			User,
			forMember((dest) => dest._id, ignore())
		);
	}

	private readUserDtoMap(mapper: any) {
		createMap(mapper, User, ReadUserDto);
	}
}
