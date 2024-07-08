'use client';

import { Container, SimpleGrid } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import Note, { NewNote, NoteModal } from '@/components/Note';
import useFetchData from '@/hooks/useFetchData';
import { apiCall, failure } from '@/lib/client_functions';
import { NoteDocument } from '@/models/Note';

export default function NotesPage() {
  const { data, refetch } = useFetchData('/api/notes/archived');
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

  const handleClick = (note: NoteDocument) => {
    open();
    form.setValues({
      _id: String(note?._id),
      title: note?.title,
      note: note?.note,
      color: note?.color,
      isArchived: note?.isArchived,
      isPinned: note?.isPinned,
      isTrashed: note?.isTrashed,
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
      await apiCall('/api/notes', remainingNote, 'POST')
        .then(() => {
          refetch();
        })
        .catch((err) => {
          failure(err.response.data.error);
        });
    }
  };

  const updateNote = async (note: any) => {
    await apiCall('/api/notes', note, 'POST')
      .then(() => {
        refetch();
      })
      .catch((err) => {
        failure(err.response.data.error);
      });
  };

  const onSave = async (note: any) => {
    if (note?.title || note?.note) {
      if (note?._id) {
        const _note = data?.find((n: any) => n._id === note?._id);
        const formValuesString = JSON.stringify({
          _id: note?._id,
          title: note?.title,
          note: note?.note,
          color: note?.color,
          isTrashed: note?.isTrashed,
          isArchived: note?.isArchived,
          isPinned: note?.isPinned,
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
    form.reset();
    close();
  };

  return (
    <>
      <NewNote newNote={newNote} />
      <Container px={0} size="md">
        <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }}>
          {data?.map((note: NoteDocument) => (
            <Note key={String(note?._id)} note={note} handleClick={handleClick} />
          ))}
        </SimpleGrid>
      </Container>
      <NoteModal opened={opened} form={form} onSave={onSave} />
    </>
  );
}
