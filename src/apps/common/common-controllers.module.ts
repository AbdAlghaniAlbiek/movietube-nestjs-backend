import { Module } from '@nestjs/common';
import { AuthRepo } from 'src/data/repositories/controllers-repos/common-repos/auth.repo';
import { AuthController } from './controllers/auth.controller';

@Module({
	controllers: [AuthController],
	providers: [AuthRepo]
})
export class CommonControllersModule {}
