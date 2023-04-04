import { applyDecorators, Controller, ControllerOptions } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions, ApiTags } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { Allow } from 'class-validator';

export function ApiController(controllerName: ControllerOptions) {
	return applyDecorators(
		Controller(controllerName),
		ApiTags(controllerName.path[0])
	);
}

export function AutoMapApiProperty(apiPropertyOptions?: ApiPropertyOptions) {
	return applyDecorators(AutoMap, ApiProperty(apiPropertyOptions));
}

export function AutoMapAllowApiProperty(
	apiPropertyOptions?: ApiPropertyOptions
) {
	return applyDecorators(AutoMap, Allow, ApiProperty(apiPropertyOptions));
}
