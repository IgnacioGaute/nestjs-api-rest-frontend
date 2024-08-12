import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@test.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
            {
              method: "POST",
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
              }),
              headers: { "Content-Type": "application/json" },
            }
          );

          if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Authentication failed');
          }

          const user = await res.json();
          return user;
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message || 'Authentication failed');
          }
          throw new Error('Authentication failed');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  }
});

export { handler as GET, handler as POST };