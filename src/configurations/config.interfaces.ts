export interface NodeConfig {
	NODE_ENV: string;
	PORT: number;
}

export interface AesConfig {
	KEY: string;
	IV: string;
}

export interface HashingConfig {
	SALT: string;
}

export interface JwtConfig {
	ALGORITHM: string;
	ACCESS_TOKEN_EXPIRES_IN: string;
	REFRESH_TOKEN_EXPIRES_IN: string;
	NO_TIMESTAMP: boolean;
	KEY_ID: string;
	AUDIENCE: string;
	ISSUER: string;
	JWT_ID: string;
	PUBLIC_KEY: string;
	PRIVATE_KEY: string;
}

export interface MongoConfig {
	MONGO_HOST: string;
	MONGO_USER: string;
	MONGO_PASSWORD: string;
	MONGO_PORT: number;
	MONGO_DB_NAME: string;
	MONGO_CONNNECTION_STRING: string;
}

export interface MailConfig {
	HOST: string;
	PORT: string;
	IS_SECURE: boolean;
	DEFAULT_FROM_USER: string;
	AUTH_USER: string;
	AUTH_PASSWORD: string;
}

export interface RedisConfig {
	HOST: string;
	PORT: string;
	USER: string;
	PASSWORD: string;
}
