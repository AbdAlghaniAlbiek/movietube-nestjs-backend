import { PartialType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
	IsEmail,
	IsStrongPassword,
	IsNotEmpty,
	IsString,
	MinLength,
	MaxLength
} from 'class-validator';
import { AutoMapApiProperty } from 'src/helpers/decorators/swagger.decorator';

export class AuthUserDto {
	@IsString()
	@IsEmail({ domain_specific_validation: true })
	@IsNotEmpty()
	@AutoMapApiProperty()
	public email: string;

	@IsString()
	@IsStrongPassword({
		minLength: 12,
		minLowercase: 3,
		minNumbers: 3,
		minSymbols: 3,
		minUppercase: 3
	})
	@IsNotEmpty()
	@AutoMapApiProperty()
	public password: string;
}

export class CreateUserDto {
	@IsNotEmpty()
	@IsEmail({ domain_specific_validation: true })
	@AutoMapApiProperty()
	public email: string;

	@Exclude()
	@IsNotEmpty()
	@IsStrongPassword({
		minLength: 12,
		minUppercase: 3,
		minLowercase: 3,
		minNumbers: 3,
		minSymbols: 3
	})
	@AutoMapApiProperty()
	public password: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(1)
	@MaxLength(30)
	@AutoMapApiProperty()
	public name: string;

	@IsNotEmpty()
	@IsString()
	@AutoMapApiProperty()
	public imagePath: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
