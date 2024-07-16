'use client';

import {
  Avatar,
  Badge,
  Container,
  Grid,
  Group,
  Modal,
  Paper,
  rem,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconMapPinFilled, IconStarFilled } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { sumOfDigits } from '@/lib/client_functions';
import { COLORS } from '@/lib/constants';

export const ProfileInfo = ({ profile, username }: { profile: any; username: string }) => {
  const isMobile = useMediaQuery('(max-width: 650px)');
  const [sparkedBy, setSparkedBy] = useDisclosure(false);
  const [sparkedTo, setSparkedTo] = useDisclosure(false);
  const router = useRouter();

  return (
    <>
      <Container px={0} size="md">
        <Paper p="xs" withBorder>
          <Grid gutter={rem(0)}>
            <Grid.Col span={{ base: 4, sm: 3 }}>
              <Avatar
                variant="outline"
                src={profile?.user?.image}
                alt={profile?.user?.name}
                name={username}
                color="initials"
                size={rem(isMobile ? 100 : 200)}
                radius="50%"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 8, sm: 9 }}>
              <Stack gap="xs">
                <Title order={3}>{profile?.user?.username}</Title>
                <Group gap="xs" wrap="nowrap">
                  <Badge
                    size={isMobile ? 'xs' : 'md'}
                    radius="xs"
                    variant="transparent"
                    px={0}
                    color="red"
                    leftSection={profile?.posts?.length || '0 '}
                  >
                    Posts
                  </Badge>
                  <Badge
                    size={isMobile ? 'xs' : 'md'}
                    radius="xs"
                    variant="transparent"
                    px={0}
                    color="green"
                    leftSection={
                      (Array.isArray(profile?.by) ? profile?.by?.length : profile?.by) || '0 '
                    }
                    onClick={() => Array.isArray(profile?.by) && setSparkedBy.open()}
                  >
                    Sparks
                  </Badge>
                  <Badge
                    size={isMobile ? 'xs' : 'md'}
                    radius="xs"
                    variant="transparent"
                    px={0}
                    color="blue"
                    leftSection={
                      (Array.isArray(profile?.to) ? profile?.to?.length : profile?.to) || '0 '
                    }
                    onClick={() => Array.isArray(profile?.to) && setSparkedTo.open()}
                  >
                    Sparking
                  </Badge>
                </Group>
                <Text fw={700}>{profile?.user?.name}</Text>
                <Text
                  style={{ lineHeight: 0.75 }}
                  dangerouslySetInnerHTML={{ __html: profile?.user?.bio || '' }}
                />
                <Group gap="xs">
                  {profile?.user?.interests?.map((interest: string) => (
                    <Badge
                      key={interest}
                      leftSection={<IconStarFilled style={{ width: rem(12), height: rem(12) }} />}
                      radius="xs"
                      variant="filled"
                      color={COLORS[sumOfDigits(interest)]}
                    >
                      {interest}
                    </Badge>
                  ))}
                </Group>
                {profile?.user?.city && (
                  <Badge
                    variant="transparent"
                    px={0}
                    leftSection={<IconMapPinFilled style={{ width: rem(14), height: rem(14) }} />}
                  >
                    {profile?.user?.city}
                  </Badge>
                )}
              </Stack>
            </Grid.Col>
          </Grid>
        </Paper>
      </Container>
      {Array.isArray(profile?.by) && profile?.by?.length > 0 && (
        <Modal
          opened={sparkedBy}
          onClose={() => setSparkedBy.close()}
          title="Sparked By"
          withCloseButton
        >
          <Stack gap={0}>
            {profile?.by?.map((by: any) => (
              <Paper
                onClick={() => router.push(`/network/${by?.to?.username}`)}
                style={{ cursor: 'pointer' }}
                radius={0}
                p="xs"
                withBorder
              >
                <Group>
                  <Avatar src={by?.to?.image} name={by?.to?.name} color="initials" />
                  <Text key={String(by?._id)}>{by?.to?.username}</Text>
                </Group>
              </Paper>
            ))}
          </Stack>
        </Modal>
      )}
      {Array.isArray(profile?.to) && profile?.to?.length > 0 && (
        <Modal
          opened={sparkedTo}
          onClose={() => setSparkedTo.close()}
          title="Sparking"
          withCloseButton
        >
          <Stack gap={0}>
            {profile?.to?.map((to: any) => (
              <Paper
                onClick={() => router.push(`/network/${to?.by?.username}`)}
                style={{ cursor: 'pointer' }}
                radius={0}
                p="xs"
                withBorder
              >
                <Group>
                  <Avatar src={to?.by?.image} name={to?.by?.name} color="initials" />
                  <Text key={String(to?._id)}>{to?.by?.username}</Text>
                </Group>
              </Paper>
            ))}
          </Stack>
        </Modal>
      )}
    </>
  );
};
