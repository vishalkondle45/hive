'use client';

import { useEffect } from 'react';
import { Button, Container, Group, Paper, Select, TagsInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { nprogress } from '@mantine/nprogress';
import { error, success } from '@/utils/functions';
import { AlbumDocument } from '@/types/models';
import { useAppDispatch, useAppSelector } from '@/store/features/hooks';
import { setAlbums } from '@/store/features/musicSlice';
import { setLoading } from '@/store/features/commonSlice';
import { getAlbums, postSongs } from '@/services/Music.service';

const CreateAlbum = () => {
  const albums = useAppSelector((state) => state.musicSlice.albums);
  const dispatch = useAppDispatch();

  const form = useForm({
    initialValues: {
      album: '',
      songs: [],
    },
    validate: {
      album: (value) => (!value ? 'Album should be selected' : null),
      songs: (value) => (value.length < 1 ? 'Atleast 1 song is required' : null),
    },
  });

  const onUploadSongs = async (values: typeof form.values) => {
    nprogress.start();
    try {
      dispatch(setLoading(true));
      const res = await postSongs(values);
      success({ message: res.data.message });
    } catch (e: any) {
      error({ message: e.response.data.error });
    } finally {
      dispatch(setLoading(false));
      nprogress.complete();
    }
  };

  const getAlbumsList = async () => {
    try {
      dispatch(setLoading(true));
      const res = await getAlbums();
      dispatch(setAlbums(res.data.albums));
    } catch (err) {
      error(JSON.stringify(err));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    getAlbumsList();
  }, []);

  return (
    <Container size="xs" px={0}>
      <Paper shadow="xl" p="md">
        <form onSubmit={form.onSubmit(onUploadSongs)} onReset={form.onReset}>
          <Select
            label="Select Album"
            placeholder="Search for album"
            data={albums?.map(({ _id, title }: AlbumDocument) => ({
              value: String(_id),
              label: title,
            }))}
            searchable
            {...form.getInputProps('album')}
          />
          <TagsInput label="Song" placeholder="Add songs" {...form.getInputProps('songs')} />
          <Group justify="flex-end" mt="md">
            <Button color="red" type="reset">
              Reset
            </Button>
            <Button color="green" type="submit">
              Submit
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateAlbum;
