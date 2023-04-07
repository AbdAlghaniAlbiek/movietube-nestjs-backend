import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import mongoose, { ObjectId } from 'mongoose';
import { AutoMapProp } from 'src/helpers/decorators/orm.decorator';
import { Movie } from './movie.schema';

export type ActorDocument = Actor & Document;

@Schema()
export class Actor {
	@Transform(({ value }) => value.toString())
	public _id: ObjectId | string;

	@AutoMapProp()
	public name: string;

	@AutoMapProp()
	public imagePath: string;

	@Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Movie.name }])
	@Type(() => Movie)
	public movies: Movie[];
}

export const ActorSchema = SchemaFactory.createForClass(Actor);
