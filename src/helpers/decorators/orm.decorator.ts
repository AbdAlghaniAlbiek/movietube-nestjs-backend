import { AutoMap } from '@automapper/classes';
import { applyDecorators } from '@nestjs/common';
import { Prop, PropOptions } from '@nestjs/mongoose';

export function AutoMapProp(
	propOptions: PropOptions<any> | undefined = undefined
) {
	return applyDecorators(AutoMap, Prop(propOptions));
}
