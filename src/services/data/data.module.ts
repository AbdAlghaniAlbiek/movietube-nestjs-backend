import { Module } from '@nestjs/common';
import { UserProfile } from './mappers/person-profile.mapper';

@Module({
	exports: [UserProfile],
	providers: [UserProfile]
})
export class DataModule {}
