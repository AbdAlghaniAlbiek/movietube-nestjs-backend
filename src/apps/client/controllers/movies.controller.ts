import { ApiController } from 'src/helpers/decorators/swagger.decorator';
import {
	VERSION_NEUTRAL,
	Get,
	Param,
	HttpCode,
	HttpStatus
} from '@nestjs/common';
import { MoviesRepo } from 'src/data/repositories/controllers-repos/client-repos/movies.repo';
import {
	ApiBadRequestResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam
} from '@nestjs/swagger';
import { MongoIdPipe } from 'src/helpers/pipes/mongo-id.pipe';

@ApiController({ path: 'movies', version: VERSION_NEUTRAL })
export class MoviesController {
	constructor(private moviesRepo: MoviesRepo) {}

	//#region swagger config
	@ApiOperation({ summary: 'Get best movies' })
	@ApiOkResponse({
		description: 'Getting best movies successfuly'
	})
	@ApiInternalServerErrorResponse({
		description: 'When Mongoose related error just occurs'
	})
	//#endregion
	@Get('')
	@HttpCode(HttpStatus.OK)
	public getBestMovies() {
		return this.moviesRepo.getBestMovies();
	}

	//#region swagger config
	@ApiOperation({ summary: 'Get actors of specific movie' })
	@ApiOkResponse({
		description: 'Getting actors of specific movie successfuly'
	})
	@ApiBadRequestResponse({
		description: 'When Param not match specific rules'
	})
	@ApiNotFoundResponse({
		description: 'When movie not found depending on its id'
	})
	@ApiInternalServerErrorResponse({
		description: 'When Mongoose related error just occurs'
	})
	@ApiParam({
		name: 'movieId',
		type: String,
		required: true,
		description: 'id of specific movie'
	})
	//#endregion
	@Get('get-movie-actors/:movieId')
	@HttpCode(HttpStatus.OK)
	public getMovieActors(@Param('movieId', MongoIdPipe) movieId: string) {
		return this.moviesRepo.getMovieActors(movieId);
	}

	//#region swagger config
	@ApiOperation({ summary: 'Get comments of specific movie' })
	@ApiOkResponse({
		description: 'Getting comments of specific movie successfuly'
	})
	@ApiBadRequestResponse({
		description: 'When Param not match specific rules'
	})
	@ApiNotFoundResponse({
		description: 'When movie not found depending on its id'
	})
	@ApiInternalServerErrorResponse({
		description: 'When Mongoose related error just occurs'
	})
	@ApiParam({
		name: 'movieId',
		type: String,
		required: true,
		description: 'id of specific movie'
	})
	//#endregion
	@Get('get-movie-comments/:movieId')
	@HttpCode(HttpStatus.OK)
	public getMovieComments(@Param('movieId', MongoIdPipe) movieId: string) {
		return this.moviesRepo.getMovieComments(movieId);
	}

	//#region swagger config
	@ApiOperation({ summary: "Get movie's details" })
	@ApiOkResponse({
		description: "Getting movie's details successfuly"
	})
	@ApiBadRequestResponse({
		description: 'When Param not match specific rules'
	})
	@ApiNotFoundResponse({
		description: 'When movie not found depending on its id'
	})
	@ApiInternalServerErrorResponse({
		description: 'When Mongoose related error just occurs'
	})
	@ApiParam({
		name: 'movieId',
		type: String,
		required: true,
		description: 'id of specific movie'
	})
	//#endregion
	@Get('get-movie-details/:movieId')
	@HttpCode(HttpStatus.OK)
	public getMovieDetails(@Param('movieId', MongoIdPipe) movieId: string) {
		return this.moviesRepo.getMovieDetails(movieId);
	}

	//#region swagger config
	@ApiOperation({ summary: "Get movie's description" })
	@ApiOkResponse({
		description: "Getting movie's description successfuly"
	})
	@ApiBadRequestResponse({
		description: 'When Param not match specific rules'
	})
	@ApiNotFoundResponse({
		description: 'When movie not found depending on its id'
	})
	@ApiInternalServerErrorResponse({
		description: 'When Mongoose related error just occurs'
	})
	@ApiParam({
		name: 'movieId',
		type: String,
		required: true,
		description: 'id of specific movie'
	})
	//#endregion
	@Get('get-movie-description/:movieId')
	@HttpCode(HttpStatus.OK)
	public getMovieDescription(@Param('movieId', MongoIdPipe) movieId: string) {
		return this.moviesRepo.getMovieDescription(movieId);
	}

	//#region swagger config
	@ApiOperation({ summary: "Get movie's photos" })
	@ApiOkResponse({
		description: "Getting movie's photos successfuly"
	})
	@ApiBadRequestResponse({
		description: 'When Param not match specific rules'
	})
	@ApiNotFoundResponse({
		description: 'When movie not found depending on its id'
	})
	@ApiInternalServerErrorResponse({
		description: 'When Mongoose related error just occurs'
	})
	@ApiParam({
		name: 'movieId',
		type: String,
		required: true,
		description: 'id of specific movie'
	})
	//#endregion
	@Get('get-movie-photos/:movieId')
	@HttpCode(HttpStatus.OK)
	public getMoviePhoto(@Param('movieId', MongoIdPipe) movieId: string) {
		return this.moviesRepo.getMoviePhoto(movieId);
	}
}
