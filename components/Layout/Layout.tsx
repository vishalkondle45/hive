'use client';

import { AppShell, Burger, Button, Container, Group, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const session = useSession();
  const isLoggedIn = session?.status === 'authenticated';
  const router = useRouter();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 200,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={mobileOpened}
              hidden={!isLoggedIn}
              onClick={toggleMobile}
              hiddenFrom="sm"
              size="sm"
            />
            <Burger
              opened={desktopOpened}
              hidden={!isLoggedIn}
              onClick={toggleDesktop}
              visibleFrom="sm"
              size="sm"
            />

            <Button
              variant="transparent"
              size="compact-md"
              color="dark"
              fw={900}
              onClick={() => router.push('/')}
              px={0}
            >
              Next_App
            </Button>
          </Group>
          <Group gap={0}>
            {isLoggedIn ? (
              <Button variant="transparent" size="compact-md" color="red" onClick={() => signOut()}>
                Logout
              </Button>
            ) : (
              <>
                <Button
                  variant="transparent"
                  size="compact-md"
                  color="blue"
                  onClick={() => router.push('/auth/register')}
                >
                  Register
                </Button>
                <Button
                  variant="transparent"
                  size="compact-md"
                  color="teal"
                  onClick={() => router.push('/auth/login')}
                >
                  Login
                </Button>
              </>
            )}
          </Group>
        </Group>
      </AppShell.Header>
      {isLoggedIn ? (
        <>
          <AppShell.Navbar p="md">Navbar</AppShell.Navbar>
          <AppShell.Main>{children}</AppShell.Main>
        </>
      ) : (
        <Container size="100%" mt={rem(80)}>
          {children}
        </Container>
      )}
    </AppShell>
  );
}
