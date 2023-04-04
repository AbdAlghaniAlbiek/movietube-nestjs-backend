import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import { ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';
import { AutoMapProp } from 'src/helpers/decorators/orm.decorator';
import { Category } from './category.schema';

export type MovieDocument = Movie & Document;

@Schema()
export class Movie {
	@Transform(({ value }) => value.toString())
	public _id: ObjectId;

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
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
