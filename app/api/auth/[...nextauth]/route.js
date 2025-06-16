import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          await connectMongoDB();
          const user = await User.findOne({ email });

          if (!user || user.provider !== "credentials") return null;

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) return null;

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      await connectMongoDB();

      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        const newUser = await User.create({
          name: user.name,
          email: user.email,
          image: user.image || profile?.picture,
          provider: account.provider || "google",
        });

        user.id = newUser._id.toString();
      } else {
        user.id = existingUser._id.toString();
      }

      return true;
    },

    async session({ session }) {
      await connectMongoDB();

      const existingUser = await User.findOne({ email: session.user.email });
      if (existingUser) {
        session.user.id = existingUser._id.toString();
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
