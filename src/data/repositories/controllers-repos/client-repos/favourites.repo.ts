import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common';
import {
	Favourite,
	FavouriteDocument
} from 'src/data/schemas/favourite.schema';
import { CrudResultMessages } from 'src/helpers/constants/result-messages.constants';
import { CRUD } from 'src/helpers/constants/crud.contants';
import { documentToClass } from 'src/helpers/resolvers/document-parser.resolver';
import { userFavHis } from 'src/data/dtos/client-dtos/responses/fav-his-dto';
import { Category, CategoryDocument } from 'src/data/schemas/category.schema';
import { Movie, MovieDocument } from 'src/data/schemas/movie.schema';

@Injectable()
export class FavouritesRepo {
	constructor(
		@InjectModel(Favourite.name) private favModel: Model<FavouriteDocument>,
		@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
		@InjectModel(Movie.name) private movieModel: Model<MovieDocument>
	) {}

	private async checkIfFavouriteExists(userId: string, movieId: string) {
		const fav = await this.favModel
			.find({ user: userId, movie: movieId })
			.exec();

		if (!fav) {
			throw new NotFoundException(
				CrudResultMessages.itemNotFound(
					`Favourite with userId: ${userId} and movieId: ${movieId}`
				)
			);
		}
	}

	public async addFavourite(userId: string, movieId: string) {
		try {
			await this.checkIfFavouriteExists(userId, movieId);

			const result = new this.favModel({ user: userId, movie: movieId });
			await result.save();

			return CrudResultMessages.successCRUD(
				`Favourite that specified to user with id: ${userId} and movie with id: ${movieId}`,
				CRUD.create
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async deleteFavourite(userId: string, movieId: string) {
		try {
			await this.checkIfFavouriteExists(userId, movieId);

			await this.favModel
				.findOneAndDelete({ user: userId, movie: movieId })
				.exec();

			return CrudResultMessages.successCRUD(
				`Favourite that specified to user with id: ${userId} and movie with id: ${movieId}`,
				CRUD.Delete
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getUserFavourites(userId: string) {
		try {
			const isFavExisted = this.favModel.find({ user: userId });

			if (!isFavExisted) {
				throw new NotFoundException(
					CrudResultMessages.itemNotFound(`Favourite with userId: ${userId}`)
				);
			}

			const favouritesDoc = await this.favModel
				.find({ user: userId }, { user: 1, movie: 1 })
				.populate(['user', 'movies'])
				.exec();

			const favourites = documentToClass(
				favouritesDoc,
				Favourite
			) as Favourite[];

			return favourites.map(
				(fav) =>
					new userFavHis(
						fav.movie.category.name,
						fav.movie._id.toString(),
						fav.movie.name,
						fav.movie.description,
						fav.movie.rate,
						fav.movie.photos.map((ph) => ph.imagePath)
					)
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getFavouriteId(userId: string, movieId: string) {
		try {
			const isFavExisted = await this.favModel
				.find({
					user: userId,
					movie: movieId
				})
				.exec();

			if (!isFavExisted) {
				throw new InternalServerErrorException(
					CrudResultMessages.itemNotFound(
						`Favourite with user: ${userId} and movieId: ${movieId}`
					)
				);
			}

			const favIds = await this.favModel
				.find({ user: userId, movie: movieId }, { _id: 1 })
				.exec();

			return favIds.map((favId) => favId._id.toString());
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}
}
