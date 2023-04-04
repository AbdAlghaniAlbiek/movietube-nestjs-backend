import { PlainLiteralObject, Type } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

function documentToClassOperation(
	document: PlainLiteralObject,
	classToIntercept: Type
) {
	return plainToClass(classToIntercept, document.toJSON());
}

export function documentToClass(
	data: PlainLiteralObject | PlainLiteralObject[],
	classToIntercept: Type
) {
	if (Array.isArray(data)) {
		return data.map(documentToClassOperation(data, classToIntercept));
	}

	return documentToClassOperation(data, classToIntercept);
}
