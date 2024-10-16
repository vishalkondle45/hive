import { Model, model, models, Schema } from 'mongoose';
import { AlbumDocument } from '@/types/models';

const albumSchema = new Schema<AlbumDocument>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    composer: {
      type: [String],
      default: [],
    },
    year: {
      type: Number,
      required: true,
    },
    poster: {
      type: String,
      required: true,
    },
    tracks: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Album = models.Album || model('Album', albumSchema);

export default Album as Model<AlbumDocument>;
