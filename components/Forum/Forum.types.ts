import { ForumDocument } from '@/models/Forum';
import { UserDocument } from '@/models/User';

export interface ForumType extends ForumDocument {
  user: UserDocument;
}
