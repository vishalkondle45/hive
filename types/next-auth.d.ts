import { Types } from 'mongoose';

interface CredentialTypes {
  email: string;
  password: string;
}

interface UserDataTypes {
  user: {
    _id?: Types.ObjectId | undefined;
    email?: string | null | undefined;
    name?: string | null | undefined;
  };
}

interface UserSessionObject {
  _id?: string;
  email: string;
}
