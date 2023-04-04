import { ConfigService } from '@nestjs/config';
import { MongoConfig } from 'src/configurations/config.interfaces';

export function MovieTubeDbSource(postgresConfig: ConfigService<MongoConfig>) {
	return {
		host: postgresConfig.get('MONGO_HOST'),
		port: postgresConfig.get('MONGO_PORT'),
		username: postgresConfig.get('MONGO_USER'),
		password: postgresConfig.get('MONGO_PASSWORD'),
		database: postgresConfig.get('MONGO_DB_NAME')
	};
}
