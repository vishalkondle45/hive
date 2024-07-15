'use client';

import {
  Button,
  Container,
  FileInput,
  Group,
  Modal,
  rem,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure, useFetch } from '@mantine/hooks';
import { IconUpload } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { apiCall, failure } from '@/lib/client_functions';
import { Post } from '@/components/Network/Post';

const NetworkPage = () => {
  const { data: posts, refetch } = useFetch('/api/network/posts');
  const [opened, { open, close }] = useDisclosure(false);
  const session: any = useSession();

  const form = useForm({
    initialValues: {
      caption: '',
      file: null as File | null,
    },
  });

  const onUpload = async () => {
    const formData = new FormData();
    formData.append('caption', form.values.caption);
    formData.append('file', form.values.file as File);
    await apiCall('/api/network/posts', formData, 'POST')
      .then(refetch)
      .catch((err) => failure(err.response.data.error))
      .finally(close);
  };

  const onLike = async (_id: string) => {
    await apiCall(`/api/network/posts/like?_id=${_id}`, null, 'PUT')
      .then(refetch)
      .catch((error) => failure(error.response.data.error));
  };
  const onSave = async (_id: string) => {
    await apiCall(`/api/network/posts/save?_id=${_id}`, null, 'PUT')
      .then(refetch)
      .catch((error) => failure(error.response.data.error));
  };

  return (
    <Container px={0} size="sm">
      <Group mb="md" justify="space-between">
        <Title order={3}>Network</Title>
        <Button
          leftSection={<IconUpload stroke={3} style={{ width: rem(16), height: rem(16) }} />}
          onClick={open}
        >
          Upload
        </Button>
      </Group>
      <Container px={0} size="xs">
        {Array.isArray(posts) && (
          <Stack>
            {posts?.map((post) => (
              <Post
                key={String(post?._id)}
                post={post}
                onLike={onLike}
                onSave={onSave}
                user={session.data?.user?._id}
              />
            ))}
          </Stack>
        )}
      </Container>
      <Modal opened={opened} onClose={close} title="Upload Post">
        <form onSubmit={form.onSubmit(onUpload)}>
          <Stack>
            <FileInput
              label="Select Image"
              placeholder="Please select image type only"
              accept="image/*"
              withAsterisk
              {...form.getInputProps('file')}
            />
            <TextInput label="Caption" placeholder="Caption" {...form.getInputProps('caption')} />
            <Group justify="right">
              <Button type="submit">Upload</Button>
            </Group>
          </Stack>
        </form>
        <Post
          post={{
            user: { username: 'vishalkondle', image: session.data?.user?.image },
            url: form?.values?.file && URL.createObjectURL(form?.values?.file),
            caption: form.values.caption,
            likes: [],
            createdAt: '2024-07-15T09:13:46.101Z',
          }}
          user={session.data?.user?._id}
        />
      </Modal>
    </Container>
  );
};

export default NetworkPage;
