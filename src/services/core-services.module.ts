import { Module } from '@nestjs/common';
import { Global } from '@nestjs/common/decorators';
import { DataModule } from './data/data.module';
import { EnhancersModule } from './enhancers/enhancers.module';
import { SecurityModule } from './security/security.module';

@Global()
@Module({
	imports: [SecurityModule, DataModule, EnhancersModule],
	exports: [SecurityModule, DataModule, EnhancersModule]
})
export class CoreServicesModule {}
