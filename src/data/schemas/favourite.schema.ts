import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import * as mongoose from 'mongoose';
import { ObjectId } from 'mongoose';
import { User } from './user.schema';
import { Movie } from './movie.schema';

export type FavouriteDocument = Favourite & Document;

@Schema()
export class Favourite {
	@Transform(({ value }) => value.toString())
	public _id: ObjectId;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
	@Type(() => User)
	user: User;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: Movie.name })
	@Type(() => Movie)
	movie: Movie;
}

export const FavouriteSchema = SchemaFactory.createForClass(Favourite);
