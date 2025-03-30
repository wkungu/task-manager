import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch("http://localhost:8000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        if (!res.ok) {
          throw new Error("Invalid credentials");
        }

        const { access_token } = await res.json();

        if (!access_token) {
          throw new Error("No token received");
        }

        // 🔹 Decode JWT to extract user email
        const decodedToken = jwt.verify(access_token, process.env.NEXTAUTH_SECRET);

        if (!decodedToken || !decodedToken.sub) {
          throw new Error("Invalid token format");
        }

        return {
          email: decodedToken.sub, // Extract user email from JWT
          access_token,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
        token.accessToken = user.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  useSecureCookies: false, // 👈 Disable secure cookies (optional)
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
