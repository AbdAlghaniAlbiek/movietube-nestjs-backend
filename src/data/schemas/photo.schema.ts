import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import * as mongoose from 'mongoose';
import { ObjectId } from 'mongoose';
import { Movie } from './movie.schema';
import { AutoMapProp } from 'src/helpers/decorators/orm.decorator';
import { Actor } from './actor.schema';
import { MovieImageType } from './constants/movie-image-type.contants';

export type PhotoDocument = Photo & Document;

@Schema()
export class Photo {
	@Transform(({ value }) => value.toString())
	public _id: ObjectId;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: Movie.name })
	@Type(() => Movie)
	movie: Movie;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: Actor.name })
	@Type(() => Actor)
	actor: Actor;

	@AutoMapProp()
	imagePath: string;

	@AutoMapProp({ enum: MovieImageType })
	movieImageType: MovieImageType;
}

export const PhotoSchema = SchemaFactory.createForClass(Photo);
