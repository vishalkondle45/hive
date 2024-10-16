import { Types } from 'mongoose';

interface UserDocument extends Document {
  _id?: Types.ObjectId;
  email: string;
  password: string;
}

interface UserMethods {
  comparePassword: (password: string) => Promise<boolean>;
}

interface AlbumDocument extends Document {
  _id?: Types.ObjectId;
  title: string;
  composer: string[];
  year: number;
  poster: string;
  tracks: string[];
}

interface SongDocument extends Document {
  _id?: Types.ObjectId;
  album: Types.ObjectId;
  title: string;
  artist: string[];
  genre: string[];
  actors: string[];
  duration: number;
  link: string;
}
