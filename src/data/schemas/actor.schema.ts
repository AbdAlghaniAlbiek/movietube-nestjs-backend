import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';
import { AutoMapProp } from 'src/helpers/decorators/orm.decorator';

export type ActorDocument = Actor & Document;

@Schema()
export class Actor {
	@Transform(({ value }) => value.toString())
	public _id: ObjectId;

	@AutoMapProp()
	public name: string;

	@AutoMapProp()
	public imagePath: string;
}

export const ActorSchema = SchemaFactory.createForClass(Actor);
