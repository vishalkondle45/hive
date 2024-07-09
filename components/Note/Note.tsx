import { Paper, rem, Text } from '@mantine/core';
import { NoteDocument } from '@/models/Note';

interface Props {
  note: NoteDocument;
  handleClick: (note: NoteDocument) => void;
}

const Note = ({ note, handleClick }: Props) => (
  <Paper
    p="md"
    radius="md"
    withBorder
    bg={note.color}
    onClick={() => handleClick(note)}
    mih={rem(120)}
    style={{ cursor: 'pointer' }}
    c={note?.color === 'gray.0' ? 'black' : 'white'}
  >
    <Text size="md" fw={500} dangerouslySetInnerHTML={{ __html: note?.title }} />
    <Text size="sm" dangerouslySetInnerHTML={{ __html: note?.note?.replace(/\r?\n/g, '<br />') }} />
  </Paper>
);

export default Note;
