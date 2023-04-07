import { Module } from '@nestjs/common';
import { CategoriesController } from './controllers/Categories.controller';
import { CategoriesRepo } from 'src/data/repositories/controllers-repos/client-repos/categories.repo';
import { FavouritesController } from './controllers/favourites.controller';
import { FavouritesRepo } from 'src/data/repositories/controllers-repos/client-repos/favourites.repo';

@Module({
	controllers: [CategoriesController, FavouritesController],
	providers: [CategoriesRepo, FavouritesRepo]
})
export class ClientModule {}
