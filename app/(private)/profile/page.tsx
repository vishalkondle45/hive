'use client';

import { Button, Container, Group, Paper, TextInput, Title } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { apiCall } from '@/lib/client_functions';

const ProfilePage = () => {
  const form = useForm({
    initialValues: {
      name: '',
      dob: null,
      username: '',
    },
    validate: {
      name: (value) => (value ? null : 'Name is required'),
      dob: (value) =>
        dayjs().diff(dayjs(value), 'year') >= 18 ? null : 'Age should be atleast 18',
    },
  });

  const onSubmit = async () => {
    const { name, dob, username } = form.values;
    await apiCall('/api/profile', { name, dob, username }, 'PUT').then(getProfile);
  };

  const getProfile = async () => {
    await apiCall('/api/profile').then((res) =>
      form.setValues({ ...res?.data, dob: new Date(res?.data.dob) })
    );
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <Container px={0} size="xs">
      <Paper p="md" withBorder>
        <Title ta="center" order={2}>
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
            mt="xs"
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
