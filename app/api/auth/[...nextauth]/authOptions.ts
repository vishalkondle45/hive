import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { CredentialTypes, UserSessionObject } from './next-auth.interfaces';
import startDb from '@/lib/db';
import UserModel from '@/models/User';
import { sendMail, verificationMessage } from '@/lib/functions';

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
        if (!user.isVerified) {
          await sendMail(user?.email, verificationMessage(user.name, String(user._id)));
          throw Error('Please verify your email!, Verification mail sent to your email');
        }

        return {
          name: user.name,
          email: user.email,
          _id: user._id,
          isAdmin: user.isAdmin,
          username: user.username,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token._id = (user as UserSessionObject)?._id;
        token.isAdmin = (user as UserSessionObject)?.isAdmin;
        token.image = (user as UserSessionObject)?.image as string;
        token.username = (user as UserSessionObject)?.username as string;
      }
      if (trigger === 'update' && session?.image) {
        token.image = session.image;
      }
      if (trigger === 'update' && session?.name) {
        token.name = session.name;
      }
      if (trigger === 'update' && session?.username) {
        token.username = session.username;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        (session.user as UserSessionObject)._id = token?._id as string;
        (session.user as UserSessionObject).isAdmin = token?.isAdmin as boolean;
        (session.user as UserSessionObject).image = token?.image as string;
        (session.user as UserSessionObject).name = token?.name as string;
        (session.user as UserSessionObject).username = token?.username as string;
      }
      return session;
    },
  },
};
