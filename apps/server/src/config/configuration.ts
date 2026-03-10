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
      port: process.env.PORT ? parseInt(process.env.PORT, 10) : 4000,
      host: process.env.HOST || '0.0.0.0',
    },
    db: {
      host: process.env.DB_HOST || (isProd ? 'postgres' : 'localhost'),
      port: parseInt(process.env.DB_PORT || (isProd ? '5432' : '5433'), 10),
      name: process.env.DB_NAME || 'khammerson',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      url: process.env.DATABASE_URL, // для совместимости
      pool: {
        max: parseInt(process.env.DB_POOL_MAX || '20', 10),
        idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
        connectionTimeout: parseInt(
          process.env.DB_CONNECTION_TIMEOUT || '2000',
          10,
        ),
      },
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    frontend: {
      url:
        process.env.FRONTEND_URL ||
        (isProd ? 'http://localhost:3005' : 'http://localhost:3006'),
    },
    trpc: {
      endpoint: '/trpc',
      playground: process.env.TRPC_PLAYGROUND === 'true' || isDev,
    },
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || [
        process.env.FRONTEND_URL || 'http://localhost:3006',
      ],
      credentials: true,
    },
  };
};

export type ConfigurationType = ReturnType<typeof configuration>;
