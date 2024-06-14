import startDb from '@/lib/db';
import UserModel from '@/models/User';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { CredentialTypes, UserSessionObject } from './next-auth.interfaces';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {},
      async authorize(credentials): Promise<any> {
        const { email, password } = credentials as CredentialTypes;

        await startDb();

        const user = await UserModel.findOne({ email });
        if (!user) throw Error('email/password mismatch!');

        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch) throw Error('email/password mismatch!');

        return {
          name: user.name,
          email: user.email,
          _id: user._id,
          isAdmin: user.isAdmin,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = (user as UserSessionObject)?._id;
        token.isAdmin = (user as UserSessionObject)?.isAdmin;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        (session.user as UserSessionObject)._id = token?._id as string;
        (session.user as UserSessionObject).isAdmin = token?.isAdmin as boolean;
      }
      return session;
    },
  },
};
