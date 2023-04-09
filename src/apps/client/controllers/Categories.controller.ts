import { ApiController } from 'src/helpers/decorators/swagger.decorator';
import {
	VERSION_NEUTRAL,
	Get,
	Param,
	HttpCode,
	HttpStatus
} from '@nestjs/common';
import { CategoriesRepo } from 'src/data/repositories/controllers-repos/client-repos/categories.repo';
import {
	ApiBadRequestResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam
} from '@nestjs/swagger';
import { Authenticated } from 'src/helpers/decorators/auth.decorator';
import { MongoIdPipe } from 'src/helpers/pipes/mongo-id.pipe';

@Authenticated()
@ApiController({ path: 'categories', version: VERSION_NEUTRAL })
export class CategoriesController {
	constructor(private categoriesRepo: CategoriesRepo) {}

	//#region swagger config
	@ApiOperation({
		summary: "Get all movies' categories to MovieTube client apps"
	})
	@ApiOkResponse({
		description: "Getting all movies' categories successfuly"
	})
	@ApiInternalServerErrorResponse({
		description: 'When Mongoose related error just occurs'
	})
	//#endregion
	@Get('')
	@HttpCode(HttpStatus.OK)
	public getCategories() {
		return this.categoriesRepo.getCategories();
	}

	//#region swagger config
	@ApiOperation({
		summary: 'Get movies of specific categories'
	})
	@ApiOkResponse({
		description: 'Gettingm ovies of specific categories successfuly'
	})
	@ApiBadRequestResponse({
		description: 'When Param not match specific rules'
	})
	@ApiNotFoundResponse({
		description: 'When category not found depending on sended id'
	})
	@ApiInternalServerErrorResponse({
		description: 'When Mongoose related error just occurs'
	})
	@ApiParam({
		type: String,
		name: 'categoryId',
		required: true,
		description: 'id of specific category'
	})
	//#endregion
	@Get('/:categoryId')
	@HttpCode(HttpStatus.OK)
	public getMoviesCategory(
		@Param('categoryId', MongoIdPipe) categoryId: string
	) {
		return this.categoriesRepo.getMoviesCategoryId(categoryId);
	}
}
