import 'dotenv/config';

interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  GOOGLE_GENERATIVE_AI_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  CLERK_SECRET_KEY: string;
}

function validateEnv(): EnvConfig {
  const requiredVars = [
    'GOOGLE_GENERATIVE_AI_API_KEY',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'CLERK_SECRET_KEY',
  ];

  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    console.error('❌ ERROR: Missing required environment variables:');
    missing.forEach((varName) => console.error(`  - ${varName}`));
    console.error('\nPlease create a .env file in the server directory with all required variables.');
    process.exit(1);
  }

  return {
    PORT: parseInt(process.env.PORT || '3000', 10),
    NODE_ENV: process.env.NODE_ENV || 'development',
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY!,
  };
}

export const env = validateEnv();
