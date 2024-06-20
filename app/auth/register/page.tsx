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
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import FormButtons from '@/components/FormButtons';
import { failure, success } from '@/lib/client_functions';

const Register = () => {
  const router = useRouter();
  const session = useSession();
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      mobile: '',
      pan: '',
      folios: [],
      isAdmin: true,
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) =>
        value.length < 8 ? 'Password should include at least 8 characters' : null,
    },
  });

  const sumbitRegister = async () => {
    await axios
      .post('/api/users/register', form.values)
      .then(() => {
        success('User registered successfully');
        router.push('/auth/login');
      })
      .catch((error) => failure(error.response.data.error));
  };

  if (session.status === 'authenticated') {
    router.push('/user');
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
              <NumberInput
                label="Mobile number"
                placeholder="Mobile number"
                {...form.getInputProps('mobile')}
                maxLength={10}
                hideControls
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
