'use client';

import {
  ActionIcon,
  AppShell,
  Burger,
  Button,
  Container,
  Group,
  Popover,
  rem,
  SimpleGrid,
  Stack,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconGridDots } from '@tabler/icons-react';
import { signOut, useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { App } from '../App';
import { APPS } from '@/lib/constants';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const session = useSession();
  const isLoggedIn = session?.status === 'authenticated';
  const isLoggedOff = session?.status === 'unauthenticated';
  const router = useRouter();
  const pathname = usePathname();
  const APP = APPS.find((app) => `/${pathname.split('/')[1]}` === app.path);

  const navigateTo = (path: string) => {
    router.push(path);
    toggleMobile();
  };

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
              {APP?.label}
            </Button>
          </Group>
          <Group gap={0}>
            {isLoggedIn && (
              <>
                <Popover position="bottom" withArrow shadow="md">
                  <Popover.Target>
                    <ActionIcon variant="subtle" color="gray" radius="xl" size="lg">
                      <IconGridDots stroke={3} style={{ width: rem(20), height: rem(20) }} />
                    </ActionIcon>
                  </Popover.Target>
                  <Popover.Dropdown p="xs">
                    <SimpleGrid spacing="xs" cols={3}>
                      {APPS.map((app) => (
                        <App isCurrent={APP?.path === app.path} key={app.path} app={app} />
                      ))}
                    </SimpleGrid>
                  </Popover.Dropdown>
                </Popover>
                <Button
                  variant="transparent"
                  size="compact-md"
                  color="red"
                  onClick={() => signOut()}
                >
                  Logout
                </Button>
              </>
            )}
            {isLoggedOff && (
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
          <AppShell.Navbar>
            <Stack gap="xs" my="xs">
              {APP?.sidebar.map((item) => (
                <Button
                  key={item.label}
                  justify="left"
                  onClick={() => navigateTo(item.path)}
                  leftSection={item.icon}
                  radius={0}
                  variant={pathname === item.path ? 'filled' : 'subtle'}
                  color={APP.color}
                  fullWidth
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          </AppShell.Navbar>
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
