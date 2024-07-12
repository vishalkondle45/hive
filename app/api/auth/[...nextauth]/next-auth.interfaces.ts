import { Types } from 'mongoose';

export interface CredentialTypes {
  email: string;
  password: string;
}

export interface UserDataTypes {
  user: {
    _id?: Types.ObjectId | undefined;
    name?: string | null | undefined;
    email?: string | null | undefined;
    isAdmin?: boolean | undefined;
    image?: string | undefined;
    username?: string;
  };
}

export interface UserSessionObject {
  name: string;
  email: string;
  _id?: string;
  isAdmin?: boolean;
  image?: string;
  username?: string;
}
