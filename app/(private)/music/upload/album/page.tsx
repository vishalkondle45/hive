'use client';

import { Button, Container, Group, NumberInput, Paper, TagsInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import dayjs from 'dayjs';
import { success, error } from '@/utils/functions';
import { setLoading } from '@/store/features/commonSlice';
import { useAppDispatch } from '@/store/features/hooks';
import { postAlbum } from '@/services/Music.service';

const CreateAlbum = () => {
  const form = useForm({
    initialValues: {
      title: '',
      composer: [],
      year: Number(dayjs().format('YYYY')),
      poster: '',
    },
    validate: {
      title: (value) => (value.length < 3 ? 'Title should include at least 3 characters' : null),
      composer: (value) => (value.length < 1 ? 'Atleast 1 composer is required' : null),
      year: (value) => (value < 1900 ? 'Year should be greater than 1900' : null),
      poster: (value) => (value ? null : 'Poster is required'),
    },
  });
  const dispatch = useAppDispatch();

  const onCreateAlbum = async (values: typeof form.values) => {
    try {
      dispatch(setLoading(true));
      const res = await postAlbum(values);
      success({ message: res.data.message });
    } catch (e: any) {
      error({ message: e.response.data.error });
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Container size="xs" px={0}>
      <Paper shadow="xl" p="md">
        <form onSubmit={form.onSubmit(onCreateAlbum)} onReset={form.onReset}>
          <TextInput
            label="Title"
            placeholder="Pushpa - The Rise"
            {...form.getInputProps('title')}
          />
          <TagsInput
            label="Composers"
            placeholder="Devi Sri Prasad, Anirudh Ravichandran"
            {...form.getInputProps('composer')}
          />
          <NumberInput
            label="Year"
            placeholder="Year"
            {...form.getInputProps('year')}
            max={Number(dayjs().format('YYYY')) + 5}
          />
          <TextInput
            label="Poster Link"
            placeholder="www.posters.com/pushpa-rise.jpg"
            {...form.getInputProps('poster')}
          />
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
