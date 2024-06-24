'use client';

import {
  ActionIcon,
  AppShell,
  Avatar,
  Burger,
  Button,
  Group,
  Indicator,
  Popover,
  rem,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import { useDisclosure, useNetwork } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconGridDots, IconList, IconLogout, IconUser } from '@tabler/icons-react';
import { signOut, useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { App } from '../App';
import { APPS } from '@/lib/constants';
import { apiCall, getInitials } from '@/lib/client_functions';

export default function Layout({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const isLoggedIn = session?.status === 'authenticated';
  const router = useRouter();

  const network = useNetwork();
  const [mobileOpened, { toggle: toggleMobile, close }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const [opened, setOpened] = useState(false);
  const [opened1, setOpened1] = useState(false);
  const pathname = usePathname();
  const rootpath = pathname.split('/')[1];
  const [APP, setAPP] = useState(APPS?.find((app) => `/${rootpath}` === app?.path));

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
    if (session.status === 'unauthenticated') {
      return;
    }
    setAPP(APPS?.find((app) => `/${rootpath}` === app?.path));
    const res = await apiCall(`/api/list?schema=${rootpath}`);
    if (res?.data) {
      setAPP((old = { sidebar: [] }) => ({ ...old, sidebar: [...old.sidebar, ...res.data] }));
    }
  };

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

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: isLoggedIn ? 200 : 0,
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
              <Group gap="xs">
                <Popover
                  opened={opened}
                  onChange={setOpened}
                  position="bottom"
                  withArrow
                  shadow="md"
                  radius="lg"
                >
                  <Popover.Target>
                    <ActionIcon
                      variant="light"
                      color="gray"
                      radius="xl"
                      size={rem(40)}
                      onClick={() => setOpened((o) => !o)}
                    >
                      <IconGridDots stroke={3} style={{ width: rem(20), height: rem(20) }} />
                    </ActionIcon>
                  </Popover.Target>
                  <Popover.Dropdown p="xs">
                    <SimpleGrid spacing="xs" cols={3}>
                      {APPS?.map((app) => (
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
                <Popover
                  opened={opened1}
                  onChange={setOpened1}
                  position="bottom"
                  withArrow
                  shadow="xl"
                  width={300}
                  radius="lg"
                >
                  <Popover.Target>
                    <Indicator color={network.online ? 'teal' : 'red'} offset={5}>
                      <Avatar
                        variant=""
                        color={APP?.color}
                        radius="xl"
                        size={rem(40)}
                        onClick={() => setOpened1((o) => !o)}
                        style={{ cursor: 'pointer' }}
                      >
                        {getInitials(session?.data?.user?.name)}
                      </Avatar>
                    </Indicator>
                  </Popover.Target>
                  <Popover.Dropdown p="xs">
                    <Stack align="center">
                      <Text fw={700} size="xs">
                        {session?.data?.user?.email}
                      </Text>
                      <Stack align="center" gap={rem(4)}>
                        <Indicator color={network.online ? 'teal' : 'red'} offset={8}>
                          <Avatar variant="" color={APP?.color} radius="xl" size={rem(60)}>
                            {getInitials(session?.data?.user?.name)}
                          </Avatar>
                        </Indicator>
                        <Text fw={700} size="xs" c={network.online ? 'teal' : 'red'}>
                          {network.online ? 'Online' : 'Offline'}
                        </Text>
                      </Stack>
                      <Text fw={700} size="sm">
                        Hi {session?.data?.user?.name},
                      </Text>
                      <Group>
                        <Button
                          variant="outline"
                          radius="xl"
                          color="teal"
                          onClick={() => router.push('/profile')}
                          leftSection={<IconUser />}
                        >
                          Profile
                        </Button>
                        <Button
                          variant="outline"
                          radius="xl"
                          color="red"
                          onClick={() => signOut()}
                          leftSection={<IconLogout />}
                        >
                          Logout
                        </Button>
                      </Group>
                    </Stack>
                  </Popover.Dropdown>
                </Popover>
              </Group>
            )}
            {!isLoggedIn && (
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
      <>
        {isLoggedIn && APP?.sidebar?.length && (
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
        )}
        <AppShell.Main pt={rem(80)}>{children}</AppShell.Main>
      </>
    </AppShell>
  );
}
