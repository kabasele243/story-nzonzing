export { env } from './env';

// Parse CORS origins from environment variable (comma-separated)
const getAllowedOrigins = (): string | string[] => {
  const corsOrigin = process.env.CORS_ORIGIN;

  if (!corsOrigin) {
    return '*'; // Allow all origins if not specified
  }

  // Support comma-separated origins
  if (corsOrigin.includes(',')) {
    return corsOrigin.split(',').map(origin => origin.trim());
  }

  return corsOrigin;
};

export const config = {
  cors: {
    origin: getAllowedOrigins(),
    credentials: true,
  },
  json: {
    limit: '10mb',
  },
  server: {
    name: 'Story Pipeline Server',
  },
} as const;
