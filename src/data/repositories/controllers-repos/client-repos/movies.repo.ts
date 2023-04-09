import {
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
	MovieActorDto,
	BestMovieDto,
	MovieCommentDto,
	MovieDetails,
	MovieDescription
} from 'src/data/dtos/client-dtos/responses/movie.response.dto';
import { Actor, ActorDocument } from 'src/data/schemas/actor.schema';
import { MovieImageType } from 'src/data/schemas/constants/movie-image-type.contants';
import { Movie, MovieDocument } from 'src/data/schemas/movie.schema';
import { Photo, PhotoDocument } from 'src/data/schemas/photo.schema';
import { Rating, RatingDocument } from 'src/data/schemas/rating.schema';
import { CrudResultMessages } from 'src/helpers/constants/result-messages.constants';
import { documentToClass } from 'src/helpers/resolvers/document-parser.resolver';

@Injectable()
export class MoviesRepo {
	constructor(
		@InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
		@InjectModel(Actor.name) private actorModel: Model<ActorDocument>,
		@InjectModel(Rating.name) private ratingModel: Model<RatingDocument>,
		@InjectModel(Photo.name) private photoModel: Model<PhotoDocument>
	) {}

	private async checkIsMovieExists(movieId: string) {
		try {
			await this.movieModel.findById(movieId);
		} catch (err) {
			throw new NotFoundException(
				CrudResultMessages.itemNotFound(`Movie with id: ${movieId}`)
			);
		}
	}

	public async getBestMovies() {
		try {
			const moviesDoc = await this.movieModel
				.find(
					{},
					{ category: 1, _id: 1, name: 1, description: 1, rate: 1, photos: 1 }
				)
				.populate(['category', 'photos'])
				.exec();

			const movies = documentToClass(moviesDoc, Movie) as Movie[];

			return movies.map(
				(movie) =>
					new BestMovieDto(
						movie.category.name,
						movie._id.toString(),
						movie.name,
						movie.description,
						movie.rate,
						movie.photos.map((ph) => ph.imagePath)
					)
			);
			return;
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getMovieActors(movieId: string) {
		try {
			await this.checkIsMovieExists(movieId);

			const actorDoc = this.actorModel
				.find({ movies: movieId }, { _id: 1, name: 1, photo: 1 })
				.populate(['photo'])
				.exec();

			const actors = documentToClass(actorDoc, Actor) as Actor[];

			return actors.map(
				(actor) =>
					new MovieActorDto(
						actor._id.toString(),
						actor.name,
						actor.photo.imagePath
					)
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getMovieComments(movieId: string) {
		try {
			await this.checkIsMovieExists(movieId);

			const movieCommentsDoc = await this.ratingModel
				.find({ movie: movieId }, { user: 1, name: 1, _id: 1 })
				.populate(['user'])
				.exec();

			const movieComment = documentToClass(movieCommentsDoc, Rating) as Rating;

			return new MovieCommentDto(
				movieComment.user._id,
				movieComment.user.name,
				movieComment.user.imagePath,
				movieComment.comment
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getMovieDetails(movieId: string) {
		try {
			await this.checkIsMovieExists(movieId);

			const avgRatings = await this.ratingModel.aggregate([
				{
					$group: {
						_id: '$_id',
						avgRatingEntertament: { $avg: '$ratingEntertament' },
						ratingResolution: { $avg: '$ratingResolution' },
						ratingPerformActors: { $avg: '$ratinPerformActors' }
					}
				},
				{
					$match: {
						_id: movieId
					}
				},
				{
					$project: {
						_id: 1,
						avgRatingEntertament: 1,
						ratingResolution: 1,
						ratingPerformActors: 1
					}
				}
			]);

			const countLikeRating = await this.movieModel.aggregate([
				{
					$group: {
						_id: '$_id',
						countLike: { $sum: 1 }
					}
				},
				{
					$match: {
						liked: 1,
						_id: movieId
					}
				},
				{
					$project: {
						countLike: 1
					}
				},
				{
					$unset: ['_id']
				}
			]);

			const countDislikeRating = await this.movieModel.aggregate([
				{
					$group: {
						_id: '$_id',
						countDislike: { $sum: 1 }
					}
				},
				{
					$match: {
						liked: 2,
						_id: movieId
					}
				},
				{
					$project: {
						countDislike: 1
					}
				},
				{
					$unset: ['_id']
				}
			]);

			const totalRating = await this.ratingModel.aggregate([
				{
					$group: {
						_id: '$_id',
						countRatings: { $sum: '$totalRating' }
					}
				},
				{
					$match: {
						totalRating: { $ne: 0 },
						_id: movieId
					}
				},
				{
					$project: {
						countRatings: 1
					}
				},
				{
					$unset: ['_id']
				}
			]);

			const commentsRating = await this.ratingModel.aggregate([
				{
					$group: {
						_id: '$_id',
						countComment: { $sum: 1 }
					}
				},
				{
					$match: {
						comment: { $ne: null },
						_id: movieId
					}
				},
				{
					$project: {
						countComment: 1
					}
				},
				{
					$unset: ['_id']
				}
			]);

			return new MovieDetails(
				avgRatings[0]._id,
				avgRatings[0].avgRatingEntertament,
				avgRatings[0].ratingResolution,
				avgRatings[0].ratingPerformActors,
				commentsRating[0].countComments,
				countLikeRating[0].countLike,
				countDislikeRating[0].countDislike,
				totalRating[0].countRatings
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getMovieDescription(movieId: string) {
		try {
			await this.checkIsMovieExists(movieId);

			const movieDesc = await this.movieModel
				.findOne(
					{ _id: movieId, photos: { movie: movieId } },
					{ _id: 1, name: 1, description: 1, rate: 1, releaseDate: 1 }
				)
				.populate('photos')
				.exec();

			let banner;
			let trailer;
			let poster;

			movieDesc.photos.forEach((ph) => {
				switch (ph.movieImageType) {
					case MovieImageType.Banner:
						banner = ph.imagePath;
						break;
					case MovieImageType.Poster:
						poster = ph.imagePath;
						break;
					case MovieImageType.Trailer:
						trailer = ph.imagePath;
						break;
					default:
						break;
				}
			});

			return new MovieDescription(
				movieDesc._id.toString(),
				movieDesc.name,
				movieDesc.description,
				movieDesc.rate,
				movieDesc.moviePath,
				poster,
				trailer,
				banner,
				movieDesc.releaseDate
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getMoviePhoto(movieId: string) {
		try {
			await this.checkIsMovieExists(movieId);

			const moviePhotos = await this.photoModel
				.find(
					{
						movie: movieId,
						movieImageType: MovieImageType.None
					},
					{
						imagePath: 1
					}
				)
				.exec();

			return moviePhotos.map((ph) => ph.imagePath);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}
}
