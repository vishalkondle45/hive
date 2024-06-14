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
  };
}

export interface UserSessionObject {
  name: string;
  email: string;
  _id?: string;
  isAdmin?: boolean;
}
