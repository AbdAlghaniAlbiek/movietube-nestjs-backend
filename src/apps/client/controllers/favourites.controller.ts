import { ApiController } from 'src/helpers/decorators/swagger.decorator';
import { Param, VERSION_NEUTRAL } from '@nestjs/common';
import { FavouritesRepo } from 'src/data/repositories/controllers-repos/client-repos/favourites.repo';
import {
	ApiBadRequestResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam
} from '@nestjs/swagger';
import { MongoIdPipe } from 'src/helpers/pipes/mongo-id.pipe';

@ApiController({ path: 'favourites', version: VERSION_NEUTRAL })
export class FavouritesController {
	constructor(private favouriteRepo: FavouritesRepo) {}

	//#region swagger config
	@ApiOperation({ summary: 'Add new favourite for an user' })
	@ApiOkResponse({
		description: 'Adding new favourite to an user successfuly'
	})
	@ApiBadRequestResponse({
		description: 'When Param not match specific rules'
	})
	@ApiNotFoundResponse({
		description: 'When favourite not found depending on its userId or movieId'
	})
	@ApiInternalServerErrorResponse({
		description: 'When Mongoose related error just occurs'
	})
	@ApiParam({
		name: 'userId',
		type: String,
		required: true,
		description: 'id of specific user'
	})
	@ApiParam({
		name: 'movieId',
		type: String,
		required: true,
		description: 'id of specific movie'
	})
	//#endregion
	public addFavourite(
		@Param('userId', MongoIdPipe) userId: string,
		@Param('movieId', MongoIdPipe) movieId: string
	) {
		return this.favouriteRepo.addFavourite(userId, movieId);
	}

	//#region swagger config
	@ApiOperation({ summary: 'Delete favourite for an user' })
	@ApiOkResponse({
		description: 'Deleting favourite to an user successfuly'
	})
	@ApiBadRequestResponse({
		description: 'When Param not match specific rules'
	})
	@ApiNotFoundResponse({
		description: 'When favourite not found depending on its userId or movieId'
	})
	@ApiInternalServerErrorResponse({
		description: 'When Mongoose related error just occurs'
	})
	@ApiParam({
		name: 'userId',
		type: String,
		required: true,
		description: 'id of specific user'
	})
	@ApiParam({
		name: 'movieId',
		type: String,
		required: true,
		description: 'id of specific movie'
	})
	//#endregion
	public deleteFavourite(
		@Param('userId', MongoIdPipe) userId: string,
		@Param('movieId', MongoIdPipe) movieId: string
	) {
		return this.favouriteRepo.addFavourite(userId, movieId);
	}

	//#region swagger config
	@ApiOperation({ summary: 'Get user favourites' })
	@ApiOkResponse({
		description: 'Getting user favourite successfuly'
	})
	@ApiBadRequestResponse({
		description: 'When Param not match specific rules'
	})
	@ApiNotFoundResponse({
		description: 'When favourite not found depending on its userId'
	})
	@ApiInternalServerErrorResponse({
		description: 'When Mongoose related error just occurs'
	})
	@ApiParam({
		name: 'userId',
		type: String,
		required: true,
		description: 'id of specific user'
	})
	//#endregion
	public getUserFavourites(@Param('userId', MongoIdPipe) userId: string) {
		return this.favouriteRepo.getUserFavourites(userId);
	}

	//#region swagger config
	@ApiOperation({ summary: 'Get favourites ids' })
	@ApiOkResponse({
		description: 'Getting favourites ids successfuly'
	})
	@ApiBadRequestResponse({
		description: 'When Param not match specific rules'
	})
	@ApiNotFoundResponse({
		description: 'When favourite not found depending on its userId or movieId'
	})
	@ApiInternalServerErrorResponse({
		description: 'When Mongoose related error just occurs'
	})
	@ApiParam({
		name: 'userId',
		type: String,
		required: true,
		description: 'id of specific user'
	})
	@ApiParam({
		name: 'movieId',
		type: String,
		required: true,
		description: 'id of specific nivue'
	})
	//#endregion
	public getFavouriteId(
		@Param('userId', MongoIdPipe) userId: string,
		@Param('movieId', MongoIdPipe) movieId: string
	) {
		return this.favouriteRepo.getFavouriteId(userId, movieId);
	}
}
