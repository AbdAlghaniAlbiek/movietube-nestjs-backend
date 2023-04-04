import { AutoMap } from '@automapper/classes';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { AutoMapProp } from '../../helpers/decorators/orm.decorator';

export type UserDocument = User & Document;

@Schema()
export class User {
	@AutoMap()
	@Transform(({ value }) => value.toString())
	public _id: string;

	@AutoMapProp()
	public email: string;

	@AutoMapProp()
	public password: string;

	@AutoMapProp()
	public name: string;

	@AutoMapProp()
	public dateJoin: Date;

	@AutoMapProp()
	public imagePath: string;

	@AutoMapProp()
	public verifyCode: string;

	@AutoMapProp()
	public refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
