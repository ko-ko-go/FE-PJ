import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      token: string;
      role: string;
      tier: string;
      name: string;
      email: string;
      id: string;
    };
  }

  interface User {
    token: string;
    role: string;
    tier: string;
    name: string | null;
    email: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    role: string;
    tier: string;
    userId: string;
  }
}
