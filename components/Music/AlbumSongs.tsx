'use client';

import { Group, Paper, Table, Text } from '@mantine/core';
import { useAppDispatch, useAppSelector } from '@/store/features/hooks';
import { SongDocument } from '@/types/models';
import { setSelectedSong } from '@/store/features/musicSlice';

const AlbumSongs = () => {
  const { songs } = useAppSelector((state) => state.musicSlice);
  return (
    <Paper withBorder py="xs" px="md">
      <Table withRowBorders>
        <Table.Tbody>
          {songs?.map((song, index) => <Song key={String(song?._id)} song={song} index={index} />)}
        </Table.Tbody>
      </Table>
    </Paper>
  );
};

const Song = ({ song, index }: { song: SongDocument; index: number }) => {
  const dispatch = useAppDispatch();

  return (
    <Table.Tr
      key={String(song?._id)}
      style={{ cursor: 'pointer' }}
      onClick={() => dispatch(setSelectedSong(song))}
    >
      <Table.Td p={0} fw={700} ta="center">
        {index + 1}
      </Table.Td>
      <Table.Td pr={0} fw={700}>
        <Group gap={0} justify="space-between">
          <Text lineClamp={1}>{song?.title}</Text>
          <Text size="sm" ta="left">
            {song?.artist.join(', ')}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td ta="center" px={0}>
        {(song.duration / 60).toFixed(0)}:{(song.duration % 60).toFixed(0).padStart(2, '0')}
      </Table.Td>
    </Table.Tr>
  );
};

export default AlbumSongs;
