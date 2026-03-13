// src/config/configuration.ts
export const configuration = () => {
  const isProd = process.env.NODE_ENV === 'production';
  const isDev = process.env.NODE_ENV === 'development';

  return {
    env: {
      isProd,
      isDev,
      isTest: process.env.NODE_ENV === 'test',
      nodeEnv: process.env.NODE_ENV || 'development',
    },
    server: {
      isProd,
      port: process.env.PORT,
      host: process.env.HOST || '0.0.0.0',
    },
    db: {
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      name: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      pool: {
        max: parseInt(process.env.DB_POOL_MAX),
        idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT),
        connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT, 10),
      },
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
    frontend: {
      url: process.env.FRONTEND_URL,
    },
    trpc: {
      endpoint: '/trpc',
      playground: process.env.TRPC_PLAYGROUND === 'true' || isDev,
    },
    cors: {
      origin: process.env.CORS_ORIGIN?.split(','),
      credentials: true,
    },
  };
};

export type ConfigurationType = ReturnType<typeof configuration>;
