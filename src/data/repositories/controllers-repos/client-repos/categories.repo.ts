import {
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
	CategoryDto,
	MovieByCategoryDto
} from 'src/data/dtos/client-dtos/responses/category-reponse.dto';
import { Category, CategoryDocument } from 'src/data/schemas/category.schema';
import { Movie, MovieDocument } from 'src/data/schemas/movie.schema';
import { CrudResultMessages } from 'src/helpers/constants/result-messages.constants';
import { documentToClass } from 'src/helpers/resolvers/document-parser.resolver';

@Injectable()
export class CategoriesRepo {
	constructor(
		@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
		@InjectModel(Movie.name) private movieModel: Model<MovieDocument>
	) {}

	public async getCategories() {
		try {
			const categoriesDocs = await this.categoryModel
				.find()
				.select({ id: 1, name: 1, photo: 1 })
				.sort({ id: 1 })
				.populate('photo')
				.exec();

			const categories = documentToClass(
				categoriesDocs,
				Category
			) as Category[];

			return categories.map(
				(cate) =>
					new CategoryDto(cate._id.toString(), cate.name, cate.photo.imagePath)
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getMoviesCategoryId(categoryId: string) {
		try {
			const isCategoryExisted = await this.categoryModel.findById(categoryId);

			if (!isCategoryExisted) {
				throw new NotFoundException(
					CrudResultMessages.itemNotFound(`Category with id: ${categoryId}`)
				);
			}

			const moviesDoc = await this.movieModel
				.find(
					{ category: categoryId },
					{
						_id: 1,
						name: 1,
						description: 1,
						rate: 1
					}
				)
				.exec();

			const categoryDoc = await this.categoryModel
				.find(
					{ category: categoryId },
					{
						name: 1,
						photo: 1
					}
				)
				.populate('photo')
				.exec();

			const movies = documentToClass(moviesDoc, Movie) as Movie[];
			const category = documentToClass(categoryDoc, Category) as Category;

			return movies.map(
				(movie) =>
					new MovieByCategoryDto(
						category.name,
						movie._id.toString(),
						movie.name,
						movie.description,
						movie.rate,
						category.photo.imagePath
					)
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}
}
