import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Login from "@/libs/auth/login";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials) return null;
                const resp = await Login(credentials.email, credentials.password);

                if (resp && resp.success) {
                    return {
                        id: "user_session",
                        token: resp.token
                    };
                }
                return null;
            }
        })
    ],
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.token;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = {
                token: token.accessToken
            };

            return session;
        },
    },
    pages: { signIn: '/login' }
};