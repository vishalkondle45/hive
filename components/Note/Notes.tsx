import { SimpleGrid } from '@mantine/core';
import React from 'react';
import Note from './Note';
import { NoteDocument } from '@/models/Note';

interface Props {
  data: NoteDocument[];
  handleClick: (note: NoteDocument) => void;
}

export const Notes = ({ data, handleClick }: Props) => (
  <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }}>
    {data?.map((note: NoteDocument) => (
      <Note key={String(note._id)} note={note} handleClick={handleClick} />
    ))}
  </SimpleGrid>
);
