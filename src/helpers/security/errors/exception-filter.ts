import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = exception.getStatus();

		response.status(status).json({
			exceptionType: exception.name,
			statusCode: status,
			message: exception.message,
			stack: exception.stack,
			timestamp: new Date().toISOString(),
			urlPath: request.url
		});
	}
}
