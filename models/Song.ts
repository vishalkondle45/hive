import { Model, model, models, Schema } from 'mongoose';
import { SongDocument } from '@/types/models';

const songSchema = new Schema<SongDocument>(
  {
    album: {
      type: Schema.Types.ObjectId,
      ref: 'Album',
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    artist: {
      type: [String],
      default: [],
    },
    genre: {
      type: [String],
      default: [],
    },
    actors: {
      type: [String],
      default: [],
    },
    duration: {
      type: Number,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Song = models.Song || model('Song', songSchema);

export default Song as Model<SongDocument>;
