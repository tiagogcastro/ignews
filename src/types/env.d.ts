declare namespace NodeJS {
  interface ProcessEnv {
    /** SQLite connection string, e.g. file:./dev.db */
    DATABASE_URL?: string;
    /** JWT signing key used by next-auth */
    SIGNING_KEY?: string;
    /** Absolute app URL, required by next-auth outside the default port */
    NEXTAUTH_URL?: string;
    GITHUB_CLIENT_ID?: string;
    GITHUB_CLIENT_SECRET?: string;
    /** Enables the development-only credentials login. Never enable in production. */
    AUTH_DEV_LOGIN?: string;
    NEXT_PUBLIC_AUTH_DEV_LOGIN?: string;
    STRIPE_SECRET_API_KEY?: string;
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY?: string;
    /** Stripe recurring price id for the ig.news plan */
    STRIPE_PRICE_ID?: string;
    STRIPE_WEBHOOK_SECRET?: string;
    STRIPE_SUCCESS_URL?: string;
    STRIPE_CANCEL_URL?: string;
    /** stripe | sandbox (defaults to stripe when keys exist, sandbox otherwise) */
    PAYMENT_PROVIDER?: string;
    /** prismic | sandbox (defaults to prismic when endpoint exists, sandbox otherwise) */
    CMS_PROVIDER?: string;
    PRISMIC_ENDPOINT?: string;
    PRISMIC_ACCESS_TOKEN?: string;
  }
}
