'use client';

import {
  Container,
  NumberInput,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import FormButtons from '@/components/FormButtons';
import { apiCall, success } from '@/lib/client_functions';

const Register = () => {
  const router = useRouter();
  const session = useSession();
  const form = useForm({
    initialValues: {
      name: '',
      dob: null,
      username: '',
      mobile: '',
      email: '',
      password: '',
    },
    validate: {
      name: (value) => (value ? null : 'Name is required'),
      dob: (value) =>
        dayjs().diff(dayjs(value), 'year') >= 18 ? null : 'Age should be atleast 18',
      mobile: (value) => (/^[0]?[6789]\d{9}$/.test(value) ? null : 'Mobile is required'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) =>
        value.length < 8 ? 'Password should include at least 8 characters' : null,
    },
  });

  const sumbitRegister = async () => {
    await apiCall('/api/users/register', form.values, 'POST').then(() => {
      success('User registered successfully');
      router.push('/auth/login');
    });
  };

  if (session?.status === 'loading') {
    return <></>;
  }

  if (session?.status === 'authenticated') {
    router.push('/notes');
    return <></>;
  }

  return (
    <>
      <Container size="xs" px={0} maw={400}>
        <Paper p="lg" mt="xl" radius="md" withBorder>
          <Title order={3} ta="center">
            Register
          </Title>
          <form onSubmit={form.onSubmit(sumbitRegister)} onReset={form.onReset}>
            <Stack>
              <TextInput label="Name" placeholder="Name" {...form.getInputProps('name')} />
              <TextInput
                label="Username"
                placeholder="Username"
                {...form.getInputProps('username')}
              />
              <DatePickerInput
                placeholder="Pick date"
                label="Date of Birth"
                {...form.getInputProps('dob')}
                mt="xs"
              />
              <NumberInput
                label="Mobile"
                placeholder="Mobile"
                {...form.getInputProps('mobile')}
                min={0}
                minLength={10}
                maxLength={10}
                hideControls
                mt="xs"
              />
              <TextInput label="Email" placeholder="Email" {...form.getInputProps('email')} />
              <PasswordInput
                label="Password"
                placeholder="Password"
                {...form.getInputProps('password')}
              />
              <FormButtons />
            </Stack>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default Register;
