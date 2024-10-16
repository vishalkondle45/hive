'use client';

import {
  ActionIcon,
  AppShell,
  Avatar,
  Burger,
  Button,
  Container,
  FileButton,
  Group,
  Indicator,
  Popover,
  rem,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { useNetwork } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconGridDots, IconList, IconLogout, IconUser } from '@tabler/icons-react';
import { signOut, useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { App } from '../App';
import { APPS } from '@/lib/constants';
import { apiCall, getInitials } from '@/lib/client_functions';
import SpotLight from '../SpotLight';
import { RootState } from '@/store/store';
import {
  closeMobile,
  setAppsOpened,
  setUserOpened,
  toggleDesktop,
  toggleMobile,
} from '@/store/features/layoutSlice';
import { useAppSelector } from '@/store/features/hooks';
import PlayerBar from '../Music/PlayerBar';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data, status, update } = useSession() as any;
  const isLoggedIn = status === 'authenticated';
  const isLoading = status === 'loading';
  const router = useRouter();
  const pathname = usePathname();
  const rootpath = pathname.split('/')[1];
  const network = useNetwork();
  const [file, setFile] = useState<File | null>(null);
  const { selected } = useAppSelector((state) => state.musicSlice);
  const ref = useRef(null);

  const [APP, setAPP] = useState(APPS?.find((app) => `/${rootpath}` === app?.path));

  const { mobileOpened, desktopOpened, appsOpened, userOpened } = useSelector(
    (state: RootState) => state.layout
  );
  const dispatch = useDispatch();

  const navigateTo = useCallback(
    (path?: string) => {
      if (path) {
        if (path !== pathname) {
          router.push(path);
        }
        dispatch(closeMobile());
      }
    },
    [pathname]
  );

  const getList = async () => {
    if (status === 'unauthenticated') {
      return;
    }
    if (rootpath) {
      setAPP(APPS?.find((app) => `/${rootpath}` === app?.path));
      const sidebar = APPS?.find((app) => `/${rootpath}` === app?.path)?.sidebar || [];
      const res = await apiCall(`/api/list?schema=${rootpath}`);
      if (res?.data) {
        setAPP((old = { sidebar: [] }) => ({ ...old, sidebar: [...sidebar, ...res.data] }));
      }
    }
  };

  const onUpload = async (_file: File) => {
    const formData = new FormData();
    formData.append('file', _file);
    const res = await apiCall('/api/upload', formData, 'POST');
    const res1 = await apiCall('/api/profile', { image: res?.data }, 'PUT');
    update({ image: res1?.data?.image });
  };

  useEffect(() => {
    getList();
  }, [pathname]);

  useEffect(() => {
    if (file) {
      onUpload(file);
    }
  }, [file]);

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

  if (isLoading) return <></>;

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
                  onClick={() => dispatch(toggleMobile())}
                  hiddenFrom="sm"
                  size="sm"
                />
                <Burger
                  opened={desktopOpened}
                  hidden={!isLoggedIn}
                  onClick={() => dispatch(toggleDesktop())}
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
                <SpotLight />
                <Popover
                  opened={appsOpened}
                  onChange={(old) => dispatch(setAppsOpened(old))}
                  position="bottom"
                  withArrow
                  shadow="md"
                  radius="lg"
                >
                  <Popover.Target>
                    <ActionIcon
                      variant="outline"
                      color="dark"
                      radius="xl"
                      size={rem(40)}
                      onClick={() => dispatch(setAppsOpened(!appsOpened))}
                    >
                      <IconGridDots stroke={3} style={{ width: rem(20), height: rem(20) }} />
                    </ActionIcon>
                  </Popover.Target>
                  <Popover.Dropdown p="xs">
                    <SimpleGrid spacing="xs" cols={3}>
                      {APPS?.map((app) => (
                        <App
                          setOpened={(value: boolean) => dispatch(setAppsOpened(value))}
                          isCurrent={APP?.path === app?.path}
                          key={app?.path}
                          app={app}
                        />
                      ))}
                    </SimpleGrid>
                  </Popover.Dropdown>
                </Popover>
                <Popover
                  opened={userOpened}
                  onChange={(value: boolean) => dispatch(setUserOpened(value))}
                  position="bottom"
                  withArrow
                  shadow="xl"
                  width={300}
                  radius="lg"
                >
                  <Popover.Target>
                    <Indicator color={network.online ? 'teal' : 'red'} offset={5}>
                      <Avatar
                        variant="outline"
                        color="dark"
                        radius="xl"
                        size={rem(40)}
                        onClick={() => dispatch(setUserOpened(!userOpened))}
                        style={{ cursor: 'pointer' }}
                        src={data?.user?.image}
                      >
                        {getInitials(data?.user?.name)}
                      </Avatar>
                    </Indicator>
                  </Popover.Target>
                  <Popover.Dropdown p="xs">
                    <Stack align="center">
                      <Text fw={700} size="xs">
                        {data?.user?.username}
                      </Text>
                      <Stack align="center" gap={rem(4)}>
                        <FileButton accept="image/*" onChange={setFile}>
                          {(props) => (
                            <Avatar
                              variant="filled"
                              color={APP?.color}
                              radius="50%"
                              size={rem(100)}
                              style={{ cursor: 'pointer' }}
                              {...props}
                              src={data?.user?.image}
                            >
                              {getInitials(data?.user?.name)}
                            </Avatar>
                          )}
                        </FileButton>
                        <Text fw={700} size="xs" c={network.online ? 'teal' : 'red'}>
                          {network.online ? 'Online' : 'Offline'}
                        </Text>
                      </Stack>
                      <Text fw={700} size="sm">
                        Hi {data?.user?.name},
                      </Text>
                      <Group>
                        <Button
                          variant="filled"
                          radius="xl"
                          color="teal"
                          onClick={() => router.push('/network/profile')}
                          leftSection={<IconUser />}
                        >
                          Profile
                        </Button>
                        <Button
                          variant="filled"
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
        {isLoggedIn && APP?.sidebar?.length ? (
          <AppShell.Navbar zIndex={2}>
            <Stack gap={0} my="xs">
              {APP?.sidebar?.map((item) => (
                <Button
                  key={item?.path}
                  justify="left"
                  onClick={() => navigateTo(item?.path)}
                  leftSection={item?.icon || APP?.listIcon || <IconList />}
                  radius={0}
                  variant={pathname === item?.path ? 'filled' : 'subtle'}
                  color={`${item?.color || APP.color}${pathname === item?.path ? '.3' : '.5'}`}
                  fullWidth
                  title={item?.label}
                >
                  {item?.label}
                </Button>
              ))}
            </Stack>
          </AppShell.Navbar>
        ) : (
          <></>
        )}
        <AppShell.Main pt={rem(80)}>{children}</AppShell.Main>
        {selected?.link && (
          <AppShell.Footer p={8}>
            <Container px={0} size="lg">
              <PlayerBar ref={ref} />
            </Container>
          </AppShell.Footer>
        )}
      </>
    </AppShell>
  );
}
