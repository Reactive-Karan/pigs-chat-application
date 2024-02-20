import User from "@models/User";
import { connectToDB } from "@mongodb";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) {
          throw new Error("Please enter your email and password");
        }

        await connectToDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user || !user?.password) {
          console.log("Error user");
          throw new Error("Invalid email or password");
        }

        const isMatch = await compare(credentials.password, user.password);

        console.log(isMatch);

        if (!isMatch) {
          throw new Error("Invalid password");
        }

        return user;
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async session({ session }) {
      const mongodbUser = await User.findOne({ email: session.user.email });

      session.user.id = mongodbUser._id.toString();

      session.user = { ...session.user, ...mongodbUser._doc };

      return session;
    },
  },
});

export { handler as GET, handler as POST };
