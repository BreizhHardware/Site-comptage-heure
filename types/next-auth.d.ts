import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      passwordResetRequired?: boolean;
    };
  }

  interface User {
    role: string;
    passwordResetRequired?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
    passwordResetRequired?: boolean;
  }
}
