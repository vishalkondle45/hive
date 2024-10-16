'use client';

import { useEffect } from 'react';
import { SimpleGrid } from '@mantine/core';
import { error } from '@/utils/functions';
import Album from '@/components/Music/Album';
import { useAppDispatch, useAppSelector } from '@/store/features/hooks';
import { setAlbums } from '@/store/features/musicSlice';
import { setLoading } from '@/store/features/commonSlice';
import { getAlbums } from '@/services/Music.service';

const Albums = () => {
  const albums = useAppSelector((state) => state.musicSlice.albums);
  const dispatch = useAppDispatch();

  const getAlbumsList = async () => {
    try {
      dispatch(setLoading(true));
      const res = await getAlbums();
      dispatch(setAlbums(res.data.albums));
    } catch (err) {
      error(JSON.stringify(err));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    getAlbumsList();
  }, []);

  return (
    <>
      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 6 }}
        spacing={{ base: 10, sm: 'xl' }}
        verticalSpacing={{ base: 'md', sm: 'xl' }}
        mb="xl"
      >
        {albums?.map((album: any) => <Album key={album?._id} album={album} />)}
      </SimpleGrid>
    </>
  );
};

export default Albums;
