'use client';

import { Container, SimpleGrid } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { nprogress } from '@mantine/nprogress';
import axios from 'axios';
import { useEffect } from 'react';
import Note, { NewNote, NoteModal } from '@/components/Note';
import useFetchData from '@/hooks/useFetchData';
import { failure } from '@/lib/client_functions';
import { NoteDocument } from '@/models/Note';

export default function NotesPage() {
  const { data, loading, refetch } = useFetchData('/api/notes/trashed');
  const [opened, { close, open }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      _id: '',
      title: '',
      note: '',
      color: 'gray.0',
      isArchived: false,
      isPinned: false,
      isTrashed: false,
    },
  });

  useEffect(() => {
    if (loading) {
      nprogress.start();
    } else {
      nprogress.complete();
    }
  }, [loading]);

  const handleClick = (note: NoteDocument) => {
    open();
    form.setValues({
      _id: String(note._id),
      title: note.title,
      note: note.note,
      color: note.color,
      isArchived: note.isArchived,
      isPinned: note.isPinned,
      isTrashed: note.isTrashed,
    });
  };

  const newNote = async (e: any) => {
    e.preventDefault();
    open();
    form.reset();
  };

  const createNote = async (note: any) => {
    if (form.values.title || form.values.note) {
      const { _id, ...remainingNote } = note;
      await axios
        .post('/api/notes', { ...remainingNote })
        .then(() => {
          refetch();
        })
        .catch((err) => {
          failure(err.response.data.error);
        });
    }
  };

  const updateNote = async (note: any) => {
    await axios
      .put('/api/notes', { ...note })
      .then(() => {
        refetch();
      })
      .catch((err) => {
        failure(err.response.data.error);
      });
  };

  const onSave = async (note: any) => {
    nprogress.start();
    if (note.title || note.note) {
      if (note._id) {
        const _note = data?.find((n: any) => n._id === note._id);
        const formValuesString = JSON.stringify({
          _id: note._id,
          title: note.title,
          note: note.note,
          color: note.color,
          isTrashed: note.isTrashed,
          isArchived: note.isArchived,
          isPinned: note.isPinned,
        });
        const noteString = JSON.stringify({
          _id: _note?._id,
          title: _note?.title,
          note: _note?.note,
          color: _note?.color,
          isTrashed: _note.isTrashed,
          isArchived: _note.isArchived,
          isPinned: _note.isPinned,
        });
        if (formValuesString !== noteString) {
          await updateNote(note);
        }
      } else {
        await createNote(note);
      }
    }
    nprogress.complete();
    form.reset();
    close();
  };

  const onDelete = async (_id: string) => {
    nprogress.start();
    await axios
      .delete(`/api/notes?_id=${_id}`)
      .then(() => {
        refetch();
      })
      .catch((err) => {
        failure(err.response.data.error);
      });
    nprogress.complete();
    form.reset();
    close();
  };

  return (
    <>
      <NewNote newNote={newNote} />
      <Container px={0} size="md">
        <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }}>
          {data?.map((note: NoteDocument) => (
            <Note key={String(note._id)} note={note} handleClick={handleClick} />
          ))}
        </SimpleGrid>
      </Container>
      <NoteModal onDelete={onDelete} opened={opened} form={form} onSave={onSave} />
    </>
  );
}
