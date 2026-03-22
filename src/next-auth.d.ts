import NextAuth, { DefaultSession } from 'next-auth'

declare module "next-auth" {
    interface Session {
        user: {
            token: string;
        }
    }

    interface User {
        token: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken: string;
    }
}