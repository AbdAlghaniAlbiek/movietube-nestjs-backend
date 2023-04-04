import {
	PipeTransform,
	Injectable,
	ArgumentMetadata,
	BadRequestException
} from '@nestjs/common';
import { isMongoId } from 'class-validator';

@Injectable()
export class MongoIdPipe implements PipeTransform<any> {
	async transform(value: any, { metatype }: ArgumentMetadata) {
		if (isMongoId(value) && typeof value === 'string') {
			return value;
		}

		throw new BadRequestException("The sended id isn't valid MongoId");
	}
}
