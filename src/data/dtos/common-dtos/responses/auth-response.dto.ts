import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from '../requests/auth-request.dto';

export class ReadUserDto extends PartialType(CreateUserDto) {}
