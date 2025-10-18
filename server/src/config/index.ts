export { env } from './env';

export const config = {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
  json: {
    limit: '10mb',
  },
  server: {
    name: 'Story Pipeline Server',
  },
} as const;
