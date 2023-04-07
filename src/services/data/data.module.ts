import { Module } from '@nestjs/common';
import { UserProfile } from './mappers/person-profile.mapper';
import { MongooseModule } from '@nestjs/mongoose';
import { Actor, ActorSchema } from 'src/data/schemas/actor.schema';
import { Category, CategorySchema } from 'src/data/schemas/category.schema';
import { Favourite, FavouriteSchema } from 'src/data/schemas/favourite.schema';
import { HistorySchema } from 'src/data/schemas/history.schema';
import { Movie, MovieSchema } from 'src/data/schemas/movie.schema';
import { Photo, PhotoSchema } from 'src/data/schemas/photo.schema';
import { Rating, RatingSchema } from 'src/data/schemas/rating.schema';
import { User, UserSchema } from 'src/data/schemas/user.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Actor.name, schema: ActorSchema },
			{ name: Category.name, schema: CategorySchema },
			{ name: Favourite.name, schema: FavouriteSchema },
			{ name: History.name, schema: HistorySchema },
			{ name: Movie.name, schema: MovieSchema },
			{ name: Photo.name, schema: PhotoSchema },
			{ name: Rating.name, schema: RatingSchema },
			{ name: User.name, schema: UserSchema }
		])
	],
	exports: [
		UserProfile,
		MongooseModule.forFeature([
			{ name: Actor.name, schema: ActorSchema },
			{ name: Category.name, schema: CategorySchema },
			{ name: Favourite.name, schema: FavouriteSchema },
			{ name: History.name, schema: HistorySchema },
			{ name: Movie.name, schema: MovieSchema },
			{ name: Photo.name, schema: PhotoSchema },
			{ name: Rating.name, schema: RatingSchema },
			{ name: User.name, schema: UserSchema }
		])
	],
	providers: [UserProfile]
})
export class DataModule {}
