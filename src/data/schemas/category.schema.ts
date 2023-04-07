import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import mongoose, { ObjectId } from 'mongoose';
import { AutoMapProp } from 'src/helpers/decorators/orm.decorator';
import { Movie } from './movie.schema';
import { Photo } from './photo.schema';

export type CategoryDocument = Category & Document;

@Schema()
export class Category {
	@Transform(({ value }) => value.toString())
	public _id: ObjectId | string;

	@AutoMapProp()
	public name: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: Photo.name })
	@Type(() => Photo)
	public photo: Photo;

	@Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Movie.name }])
	@Type(() => Movie)
	public movies: Movie[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
