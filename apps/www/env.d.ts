// Type definitions for Next.js environment variables
/** biome-ignore-all lint/style/noNamespace: ignore NodeJS namespace */
/** biome-ignore-all lint/style/useConsistentTypeDefinitions: ignore */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_APP_URL: string;
      NEXT_PUBLIC_POSTHOG_KEY: string;
      NEXT_PUBLIC_POSTHOG_HOST: string;
    }
  }
}
export {};
