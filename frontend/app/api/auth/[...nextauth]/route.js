import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        
        const res = await fetch("http://task-manager-backend:8000/api/auth/login", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json", // Ensure JSON response
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        let data;
        try {
          data = await res.json();
        } catch (error) {
          console.error("Failed to parse JSON:", error);
          throw new Error("Invalid server response");
        }

        console.log("🔹 Login API response:", data);

        if (!res.ok || !data.access_token) {
          throw new Error("Invalid credentials");
        }

        return {
          email: credentials.email,
          access_token: data.access_token,
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
  secret: `${process.env.NEXTAUTH_SECRET}`,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 day
  },
  debug: true, // Enable logs for debugging
  csrf: false, // (Use this only if necessary)
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
