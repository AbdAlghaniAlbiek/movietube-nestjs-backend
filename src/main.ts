import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { globalSetup } from './setup/globals.setup';
import { securitySetup } from './setup/security.setup';
import { SwaggerSetup } from './setup/swagger.setup';
import { VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { NodeConfig } from './configurations/config.interfaces';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		logger: console
	});

	// Global Enhancers
	globalSetup(app);

	// Versioning of application
	app.enableVersioning({
		type: VersioningType.HEADER,
		header: 'Version',
		defaultVersion: VERSION_NEUTRAL
	});

	// Security stuff
	securitySetup(app);

	// Serve static assets
	app.useStaticAssets(join(__dirname, 'assets'));

	// Swagger setup
	SwaggerSetup(app);

	await app.listen(app.get(ConfigService<NodeConfig>).get('PORT'));

	// $ npx @compodoc/compodoc -p tsconfig.json -s  Run this Cli comman in the end of project
}
bootstrap();
