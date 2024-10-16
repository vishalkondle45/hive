'use client';

import {
  ActionIcon,
  Badge,
  Button,
  Grid,
  Group,
  Image,
  Paper,
  rem,
  Stack,
  Text,
} from '@mantine/core';
import { IconArrowsShuffle2, IconHeart, IconPlayerPlay, IconShare } from '@tabler/icons-react';
import { useAppSelector } from '@/store/features/hooks';

const AlbumInfo = () => {
  const { album, songs } = useAppSelector((state) => state.musicSlice);

  if (!album?.poster) {
    return <></>;
  }
  return (
    <Paper withBorder p="md">
      <Grid gutter={{ sm: 'xs', lg: 'md' }} grow>
        <Grid.Col span={{ base: 12, sm: 2 }}>
          <Image radius="lg" src={album?.poster} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 10 }}>
          <Stack gap="xs">
            <Badge mt="xs" mb="-lg" px={0} variant="white" size="lg" radius={0} fw={700}>
              {songs?.[0]?.genre}
            </Badge>
            <Text fz={rem('5vh')} fw={700}>
              {album?.title}
            </Text>
            <Text fw={700}>{album?.composer}</Text>
            <Group>
              <Text fw={700}>{songs?.length} Songs</Text>
              <Text fw={700}>•</Text>
              <Text fw={700}>
                {songs && Math.round(songs.reduce((a, b) => a + b.duration, 0) / 60)} Mins
              </Text>
              <Text fw={700}>•</Text>
              <Text fw={700}>{album?.year}</Text>
            </Group>
            <Group>
              <Button radius="xl" leftSection={<IconPlayerPlay />}>
                Play
              </Button>
              <ActionIcon variant="transparent">
                <IconHeart />
              </ActionIcon>
              <ActionIcon variant="transparent">
                <IconShare />
              </ActionIcon>
              <ActionIcon radius="xl" size="lg" variant="subtle">
                <IconArrowsShuffle2 />
              </ActionIcon>
            </Group>
          </Stack>
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

export default AlbumInfo;
