import envFilePath from '../helpers/resolvers/env-path.resolver';
import { resolve } from 'path';

envFilePath(resolve(process.cwd(), '.env'));

export function nodeConfig() {
	return {
		NODE_ENV: process.env.NODE_ENV,
		PORT: parseInt(<string>process.env.PORT, 10)
	};
}

export function aesConfig() {
	return {
		KEY: process.env.AES_KEY?.toString(),
		IV: process.env.AES_IV?.toString()
	};
}

export function hashConfig() {
	return {
		SALT: parseInt(<string>process.env.HASH_SALT, 10)
	};
}

export function jwtConfig() {
	return {
		ALGORITHM: process.env.JWT_ALGORITHM,
		ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
		REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
		NO_TIMESTAMP: Boolean(process.env.JWT_NO_TIMESTAMP),
		KEY_ID: parseInt(<string>process.env.JWT_KEY_ID, 10),
		AUDIENCE: process.env.JWT_AUDIENCE,
		ISSUER: process.env.JWT_ISSUER,
		JWT_ID: process.env.JWT_ID?.toString(),
		PUBLIC_KEY: process.env.JWT_PUBLIC_KEY.toString(),
		PRIVATE_KEY: process.env.JWT_PRIVATE_KEY.toString()
	};
}

export function mongoConfig() {
	return {
		MONGO_HOST: process.env.MONGO_HOST,
		MONGO_USER: process.env.MONGO_USER,
		MONGO_PASSWORD: process.env.MONGO_PASSWORD,
		MONGO_PORT: process.env.MONGO_PORT,
		MONGO_DB_NAME: process.env.MONGO_DB_NAME,
		MONGO_CONNNECTION_STRING: process.env.MONGO_CONNNECTION_STRING
	};
}

export function mailConfig() {
	return {
		HOST: process.env.MAIL_HOST,
		PORT: process.env.MAIL_PORT,
		DEFAULT_FROM_USER: process.env.MAIL_DEFAULT_FROM_USER,
		IS_SECURE: Boolean(process.env.MAIL_IS_SECURE),
		AUTH_USER: process.env.MAIL_AUTH_USER,
		AUTH_PASSWORD: process.env.MAIL_AUTH_PASSWORD.toString()
	};
}

export function redisConfig() {
	return {
		HOST: process.env.REDIS_HOST,
		PORT: process.env.REDIS_PORT
	};
}
