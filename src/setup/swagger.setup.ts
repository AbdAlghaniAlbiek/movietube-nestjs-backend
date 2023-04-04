import { SwaggerModule } from '@nestjs/swagger';
import { SwaggerDocuments } from './documents/swagger.document';
import { INestApplication } from '@nestjs/common';

export function SwaggerSetup(app: INestApplication) {
	SwaggerModule.setup(
		'common',
		app,
		SwaggerDocuments.commonSwaggerDocument(app),
		{ useGlobalPrefix: true }
	);
	SwaggerModule.setup(
		'client',
		app,
		SwaggerDocuments.clientSwaggerDocument(app),
		{ useGlobalPrefix: true }
	);
}
