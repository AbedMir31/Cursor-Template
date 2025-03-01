/**
 * Application configuration from environment variables
 * This provides a central place to access all environment variables
 * and ensures type safety for configuration values
 */

export const config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    redirectUrl: process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL as string,
  },
  app: {
    environment: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  },
};

// Validate required environment variables are set
if (!config.supabase.url || !config.supabase.anonKey) {
  throw new Error('Missing required environment variables for Supabase configuration');
}

// For OAuth, we need to ensure the redirect URL is set
if (!config.supabase.redirectUrl) {
  console.warn('Missing NEXT_PUBLIC_SUPABASE_REDIRECT_URL environment variable. OAuth flows may not work correctly.');
}

export default config; 