import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    activeSubscription: {
      id: string;
      status: string;
    } | null;
  }

  interface User {
    id?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    activeSubscription?: DefaultSession['user'];
  }
}
