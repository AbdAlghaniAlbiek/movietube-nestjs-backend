import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClientModule } from 'src/apps/client/client.module';
import { CommonControllersModule } from 'src/apps/common/common-controllers.module';

export class SwaggerDocuments {
	static clientSwaggerDocument(app: INestApplication) {
		return SwaggerModule.createDocument(
			app,
			new DocumentBuilder()
				.setTitle('Client application APIs')
				.setDescription(
					'APIs that admin application can consume it and fetch data from it'
				)
				.addBearerAuth()
				.setVersion('1.0')
				.addTag('Client')
				.build(),
			{
				include: [ClientModule]
			}
		);
	}

	static commonSwaggerDocument(app: INestApplication) {
		return SwaggerModule.createDocument(
			app,
			new DocumentBuilder()
				.setTitle('Common APIs')
				.setDescription(
					'APIs that Any application can consume it and fetch data from it'
				)
				.addBearerAuth()
				.setVersion('1.0')
				.addTag('common')
				.build(),
			{
				include: [CommonControllersModule]
			}
		);
	}
}
