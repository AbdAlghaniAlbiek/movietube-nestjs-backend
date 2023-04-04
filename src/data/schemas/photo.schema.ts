import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import * as mongoose from 'mongoose';
import { ObjectId } from 'mongoose';
import { Movie } from './movie.schema';
import { AutoMapProp } from 'src/helpers/decorators/orm.decorator';

export type PhotoDocument = Photo & Document;

@Schema()
export class Photo {
	@Transform(({ value }) => value.toString())
	public _id: ObjectId;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: Movie.name })
	@Type(() => Movie)
	movie: Movie;

	@AutoMapProp()
	imagePath: string;

	@AutoMapProp()
	banner: boolean;

	@AutoMapProp()
	poster: boolean;
}

export const PhotoSchema = SchemaFactory.createForClass(Photo);
