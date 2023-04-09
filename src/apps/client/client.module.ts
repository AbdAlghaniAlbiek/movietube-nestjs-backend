import { Module } from '@nestjs/common';
import { CategoriesController } from './controllers/Categories.controller';
import { CategoriesRepo } from 'src/data/repositories/controllers-repos/client-repos/categories.repo';
import { FavouritesController } from './controllers/favourites.controller';
import { FavouritesRepo } from 'src/data/repositories/controllers-repos/client-repos/favourites.repo';
import { MoviesController } from './controllers/movies.controller';
import { MoviesRepo } from 'src/data/repositories/controllers-repos/client-repos/movies.repo';

@Module({
	controllers: [CategoriesController, FavouritesController, MoviesController],
	providers: [CategoriesRepo, FavouritesRepo, MoviesRepo]
})
export class ClientModule {}
