'use client';

import {
  ActionIcon,
  AppShell,
  Burger,
  Button,
  Container,
  Group,
  Indicator,
  Popover,
  rem,
  SimpleGrid,
  Stack,
} from '@mantine/core';
import { useDisclosure, useNetwork } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconGridDots, IconList } from '@tabler/icons-react';
import { signOut, useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { App } from '../App';
import { APPS } from '@/lib/constants';
import { apiCall, failure } from '@/lib/client_functions';

export default function Layout({ children }: { children: React.ReactNode }) {
  const network = useNetwork();
  const [mobileOpened, { toggle: toggleMobile, close }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const [opened, setOpened] = useState(false);
  const session = useSession();
  const loading = session?.status === 'loading';
  const isLoggedIn = session?.status === 'authenticated';
  const isLoggedOff = session?.status === 'unauthenticated';
  const router = useRouter();
  const pathname = usePathname();
  const rootpath = pathname.split('/')[1];
  const [APP, setAPP] = useState(APPS.find((app) => `/${rootpath}` === app?.path));

  const navigateTo = useCallback(
    (path?: string) => {
      if (path) {
        if (path !== pathname) {
          router.push(path);
        }
        close();
      }
    },
    [pathname]
  );

  const getList = async () => {
    try {
      setAPP(APPS.find((app) => `/${rootpath}` === app?.path));
      const res = await apiCall(`/api/list?schema=${rootpath}`);
      if (res?.data) {
        setAPP((old = { sidebar: [] }) => ({ ...old, sidebar: [...old.sidebar, ...res.data] }));
      }
    } catch (error) {
      failure('Something went wrong');
    }
  };

  if (isLoggedOff) {
    router.push('/auth/login');
  }

  useEffect(() => {
    getList();
  }, [pathname]);

  useEffect(() => {
    if (!network.online) {
      notifications.clean();
      notifications.show({
        title: 'Waiting for connection.. ',
        message: 'Please connect to the internet...',
        color: 'red',
        autoClose: false,
        loading: true,
        withCloseButton: false,
      });
    } else {
      notifications.clean();
    }
  }, [network.online]);

  if (loading) {
    return <></>;
  }

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
            {APP?.sidebar?.length && (
              <>
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
              </>
            )}
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
                <Popover
                  opened={opened}
                  onChange={setOpened}
                  position="bottom"
                  withArrow
                  shadow="md"
                >
                  <Popover.Target>
                    <Indicator color={network.online ? 'teal' : 'red'} offset={5}>
                      <ActionIcon
                        variant="subtle"
                        color="gray"
                        radius="xl"
                        size="lg"
                        onClick={() => setOpened((o) => !o)}
                      >
                        <IconGridDots stroke={3} style={{ width: rem(20), height: rem(20) }} />
                      </ActionIcon>
                    </Indicator>
                  </Popover.Target>
                  <Popover.Dropdown p="xs">
                    <SimpleGrid spacing="xs" cols={3}>
                      {APPS.map((app) => (
                        <App
                          setOpened={setOpened}
                          isCurrent={APP?.path === app?.path}
                          key={app?.path}
                          app={app}
                        />
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
      {isLoggedIn && APP?.sidebar?.length ? (
        <>
          <AppShell.Navbar>
            <Stack gap={0} my="xs">
              {APP?.sidebar?.map((item) => (
                <Button
                  key={item?.path}
                  justify="left"
                  onClick={() => navigateTo(item?.path)}
                  leftSection={item?.icon || <IconList />}
                  radius={0}
                  variant={pathname === item?.path ? 'filled' : 'subtle'}
                  color={`${item?.color || APP.color}${pathname === item?.path ? '.3' : '.5'}`}
                  fullWidth
                >
                  {item?.label}
                </Button>
              ))}
            </Stack>
          </AppShell.Navbar>
          <AppShell.Main pt={rem(80)}>{children}</AppShell.Main>
        </>
      ) : (
        <Container size="100%" pt={rem(80)}>
          {children}
        </Container>
      )}
    </AppShell>
  );
}
