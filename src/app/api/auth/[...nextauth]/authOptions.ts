import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Login from "@/libs/auth/login";

function decodeJwtPayload(token: string) {
  try {
    const payload = token.split(".")[1];
    const decoded = Buffer.from(payload, "base64url").toString("utf-8");
    return JSON.parse(decoded);
  } catch {
    return {};
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const resp = await Login(credentials.email, credentials.password);

        if (resp && resp.success) {
          const payload = decodeJwtPayload(resp.token);
          return {
            id: payload._id ?? payload.id ?? "user",
            token: resp.token,
            name: payload.name ?? null,
            email: payload.email ?? null,
            role: payload.role ?? "user",
            tier: payload.tier ?? "vip",
          };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.role = user.role;
        token.tier = user.tier;
        token.name = user.name;
        token.email = user.email;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        token: token.accessToken,
        role: token.role,
        tier: token.tier,
        name: token.name as string,
        email: token.email as string,
        id: token.userId,
      };
      return session;
    },
  },
  pages: { signIn: "/auth/login" },
};
