'use client';

import {
  Button,
  Center,
  Container,
  Group,
  Loader,
  Paper,
  rem,
  Switch,
  TagsInput,
  TextInput,
  Title,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { IconShield, IconWorld } from '@tabler/icons-react';
import { apiCall } from '@/lib/client_functions';
import Document from '@/components/Document';

const ProfilePage = () => {
  const form = useForm({
    initialValues: {
      _id: '',
      name: '',
      dob: null,
      username: '',
      bio: '',
      interests: [],
      city: '',
      isPrivate: false,
    },
    validate: {
      name: (value) => (value ? null : 'Name is required'),
      dob: (value) =>
        dayjs().diff(dayjs(value), 'year') >= 18 ? null : 'Age should be atleast 18',
    },
  });

  const onSubmit = async () => {
    const { _id, ...remaining } = form.values;
    await apiCall('/api/profile', remaining, 'PUT').then(getProfile);
  };

  const getProfile = async () => {
    await apiCall('/api/profile').then((res) =>
      form.setValues({ ...res?.data?.user, dob: new Date(res?.data.user.dob) })
    );
  };

  const iconStyle = { width: rem(16), height: rem(16) };

  useEffect(() => {
    getProfile();
  }, []);

  if (!form.values._id) {
    return (
      <Center h="80vh">
        <Loader />
      </Center>
    );
  }

  return (
    <Container px={0} size="xs">
      <Paper p="md" withBorder>
        <Title ta="center" order={3}>
          Profile
        </Title>
        <form onSubmit={form.onSubmit(onSubmit)} onReset={getProfile}>
          <TextInput label="Name" placeholder="Name" {...form.getInputProps('name')} mt="xs" />
          <TextInput
            label="Username"
            placeholder="Username"
            {...form.getInputProps('username')}
            mt="xs"
          />
          <DatePickerInput
            placeholder="Pick date"
            label="Date of Birth"
            {...form.getInputProps('dob')}
            my="xs"
          />
          {form.values._id && (
            <Document
              content={form.values.bio}
              onUpdate={(str) => form.setFieldValue('bio', str)}
              placeholder="Bio"
              isDocumentPage={false}
            />
          )}
          <TagsInput
            label="Interests"
            placeholder="Interests"
            {...form.getInputProps('interests')}
            mt="xs"
          />
          <TextInput label="City" placeholder="City" {...form.getInputProps('city')} mt="xs" />
          <Switch
            label={`${form.values.isPrivate ? 'Private' : 'Public'} Profile`}
            description={`${form.values.isPrivate ? 'Only visible to your sparkers' : 'Visible to everyone'}`}
            onLabel={<IconShield style={iconStyle} />}
            offLabel={<IconWorld style={iconStyle} />}
            mt="xs"
            {...form.getInputProps('isPrivate', { type: 'checkbox' })}
          />
          <Group justify="right" mt="xs">
            <Button color="red" type="reset">
              Reset
            </Button>
            <Button color="green" type="submit">
              Update
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
