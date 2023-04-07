import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import { ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';
import { AutoMapProp } from 'src/helpers/decorators/orm.decorator';
import { Category } from './category.schema';
import { Actor } from './actor.schema';
import { Photo } from './photo.schema';

export type MovieDocument = Movie & Document;

@Schema()
export class Movie {
	@Transform(({ value }) => value.toString())
	public _id: ObjectId | string;

	@AutoMapProp()
	public name: string;

	@AutoMapProp()
	public description: string;

	@AutoMapProp()
	public rate: number;

	@AutoMapProp()
	public moviePath: string;

	@AutoMapProp()
	public trailerPath: string;

	@AutoMapProp()
	public releaseDate: Date;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: Category.name })
	@Type(() => Category)
	category: Category;

	@Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Actor.name }])
	@Type(() => Actor)
	actors: Actor[];

	@Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Photo.name }])
	@Type(() => Photo)
	public photos: Photo[];
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
