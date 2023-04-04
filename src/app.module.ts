import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import {
	CacheModule,
	ClassSerializerInterceptor,
	InternalServerErrorException,
	Module,
	ValidationPipe
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerGuard } from '@nestjs/throttler/dist/throttler.guard';
import {
	aesConfig,
	hashConfig,
	jwtConfig,
	mailConfig,
	nodeConfig,
	mongoConfig,
	redisConfig
} from './configurations/config.env';
import { MongoConfig, RedisConfig } from './configurations/config.interfaces';
import { TimeoutInterceptor } from './helpers/increptors/timeout.increptor';
import { CoreServicesModule } from './services/core-services.module';

import { CommonControllersModule } from './apps/common/common-controllers.module';
import { BullModule } from '@nestjs/bull';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientModule } from './apps/client/client.module';
import { MovieTubeDbSource } from './data/data-source/mongo-db-source';

@Module({
	imports: [
		ConfigModule.forRoot({
			expandVariables: true,
			isGlobal: true,
			cache: true,
			load: [
				aesConfig,
				hashConfig,
				jwtConfig,
				mailConfig,
				nodeConfig,
				mongoConfig,
				redisConfig
			]
		}),
		MongooseModule.forRootAsync({
			connectionName: 'movietube_mongoConnection',
			useFactory: async (mongoConfig: ConfigService<MongoConfig>) => {
				const username = MovieTubeDbSource(mongoConfig).username;
				const password = MovieTubeDbSource(mongoConfig).password;
				const port = MovieTubeDbSource(mongoConfig).port;
				const host = MovieTubeDbSource(mongoConfig).host;

				return await {
					uri: `mongodb://${username}:${password}@${host}:${port}`,
					dbName: MovieTubeDbSource(mongoConfig).database
				};
			},
			inject: [ConfigService]
		}),
		ThrottlerModule.forRoot({
			ttl: 60,
			limit: 10
		}),
		AutomapperModule.forRoot({
			strategyInitializer: classes(),
			errorHandler: {
				handle: (err) => {
					throw new InternalServerErrorException(`${err}`);
				}
			}
		}),
		BullModule.forRootAsync({
			useFactory: (redisConfig: ConfigService<RedisConfig>) => ({
				redis: {
					host: redisConfig.get('HOST'),
					port: redisConfig.get('PORT'),
					username: redisConfig.get('USER'),
					password: redisConfig.get('PASSWORD')
				}
			}),
			inject: [ConfigService]
		}),
		CacheModule.registerAsync({
			useFactory: (redisConfig: ConfigService<RedisConfig>) =>
				<RedisClientOptions>{
					isGlobal: true,
					store: redisStore,
					host: redisConfig.get('HOST'),
					port: redisConfig.get('PORT'),
					username: redisConfig.get('USER'),
					password: redisConfig.get('PASSWORD')
				},
			inject: [ConfigService]
		}),
		EventEmitterModule.forRoot({ global: true }),
		CoreServicesModule,
		CommonControllersModule,
		ClientModule
	],
	providers: [
		{
			provide: APP_PIPE,
			useClass: ValidationPipe
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ClassSerializerInterceptor
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: TimeoutInterceptor
		},
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard
		}
	]
})
export class AppModule {}
