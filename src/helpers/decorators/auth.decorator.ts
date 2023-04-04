import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AccessTokenAuthGuard } from 'src/services/security/guards/access-token.guard';
import { RefreshTokenAuthGuard } from 'src/services/security/guards/refresh-token.guard';
import { AuthResultMessages } from '../constants/result-messages.constants';

export function Authenticated() {
	return applyDecorators(
		UseGuards(AccessTokenAuthGuard, RefreshTokenAuthGuard),
		ApiBearerAuth(),
		ApiUnauthorizedResponse({
			description: AuthResultMessages.unauthorizedUser()
		})
	);
}

// export function Authorized(...roles: UserRole[]) {
// 	return applyDecorators(
// 		Roles(...roles),
// 		UseGuards(AccessTokenAuthGuard, RefreshTokenAuthGuard),
// 		ApiBearerAuth(),
// 		ApiUnauthorizedResponse({
// 			description: AuthResultMessages.forbiddenAccessOnThisResource()
// 		})
// 	);
// }
