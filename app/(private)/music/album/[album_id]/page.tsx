'use client';

import { Container, Stack } from '@mantine/core';
import { useCallback, useEffect } from 'react';
import AlbumInfo from '@/components/Music/AlbumInfo';
import { error } from '@/utils/functions';
import AlbumSongs from '@/components/Music/AlbumSongs';
import { useAppDispatch } from '@/store/features/hooks';
import { setAlbum, setSongs } from '@/store/features/musicSlice';
import { getSongs } from '@/services/Music.service';
import { setLoading } from '@/store/features/commonSlice';

const Albums = ({ params }: { params: { album_id: string } }) => {
  const dispatch = useAppDispatch();
  const getAlbum = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const res = await getSongs(params.album_id);
      dispatch(setSongs(res.data.songs));
      dispatch(setAlbum(res.data.album));
    } catch (err) {
      error(JSON.stringify(err));
    } finally {
      dispatch(setLoading(false));
    }
  }, [params.album_id]);

  useEffect(() => {
    if (params.album_id) {
      getAlbum();
    }
  }, [params.album_id]);

  return (
    <>
      <Container size="100%" px={0}>
        <Stack>
          <AlbumInfo />
          <AlbumSongs />
        </Stack>
      </Container>
    </>
  );
};

export default Albums;
