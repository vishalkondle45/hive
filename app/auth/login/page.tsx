'use client';

import { Container, Paper, PasswordInput, Stack, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import FormButtons from '@/components/FormButtons';
import { failure } from '@/lib/client_functions';

const Login = () => {
  const router = useRouter();
  const { status } = useSession();
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) =>
        value.length < 8 ? 'Password should include at least 8 characters' : null,
    },
  });

  const sumbitLogin = async () => {
    await signIn('credentials', { ...form.values, redirect: false }).then((res) => {
      if (res?.ok) {
        router.push('/profile');
        router.refresh();
      } else {
        failure(res?.error || '');
      }
    });
  };

  if (status === 'loading') {
    return <></>;
  }

  if (status === 'authenticated') {
    router.push('/notes');
    return <></>;
  }

  return (
    <>
      <Container size="xs" px={0} maw={400}>
        <Paper p="lg" mt="xl" radius="md" withBorder>
          <Title order={3} ta="center">
            Login
          </Title>
          <form onSubmit={form.onSubmit(sumbitLogin)} onReset={form.onReset}>
            <Stack>
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

export default Login;
