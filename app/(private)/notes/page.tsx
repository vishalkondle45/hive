'use client';

import { useForm } from '@mantine/form';
import { Container, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { nprogress } from '@mantine/nprogress';
import axios from 'axios';
import { useEffect } from 'react';
import { NewNote, NoteModal, Notes } from '@/components/Note';
import useFetchData from '@/hooks/useFetchData';
import { failure } from '@/lib/client_functions';
import { NoteDocument } from '@/models/Note';

export default function NotesPage() {
  const { data, loading, refetch } = useFetchData('/api/notes');
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

  const pinned = data?.filter((note: NoteDocument) => note.isPinned);
  const others = data?.filter((note: NoteDocument) => !note.isPinned);

  return (
    <>
      <NewNote newNote={newNote} />
      <Container px={0} size="md">
        {pinned?.length > 0 && (
          <>
            <Text size="sm" mb="xs">
              PINNED
            </Text>
            <Notes data={pinned} handleClick={handleClick} />
            <Text size="sm" my="xs">
              OTHERS
            </Text>
          </>
        )}
        <Notes data={others} handleClick={handleClick} />
      </Container>
      <NoteModal opened={opened} form={form} onSave={onSave} />
    </>
  );
}