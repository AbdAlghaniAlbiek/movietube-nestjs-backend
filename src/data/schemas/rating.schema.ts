import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import * as mongoose from 'mongoose';
import { ObjectId } from 'mongoose';
import { Movie } from './movie.schema';
import { AutoMapProp } from 'src/helpers/decorators/orm.decorator';
import { User } from './user.schema';

export type RatingDocument = Rating & Document;

@Schema()
export class Rating {
	@Transform(({ value }) => value.toString())
	public _id: ObjectId;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
	@Type(() => User)
	public user: User;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: Movie.name })
	@Type(() => Movie)
	public movie: Movie;

	@AutoMapProp()
	public ratingEntertainment: number;

	@AutoMapProp()
	public ratingResolution: number;

	@AutoMapProp()
	public ratingPerformActors: number;

	@AutoMapProp()
	public comment: string;

	@AutoMapProp()
	public ratingDate: Date;

	@AutoMapProp()
	public liked: number;

	@AutoMapProp()
	public totalRating: number;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
