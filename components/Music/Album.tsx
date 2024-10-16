import { Box, Image, Text } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { AlbumDocument } from '@/types/models';

interface Props {
  album: AlbumDocument;
}

const Album = ({ album }: Props) => {
  const router = useRouter();
  return (
    <Box onClick={() => router.push(`/music/album/${album?._id}`)} style={{ cursor: 'pointer' }}>
      <Image src={album?.poster} radius="lg" />
      <Text fw={700} size="md">
        {album?.title}
      </Text>
      <Text size="sm" c="dimmed">
        {album?.composer}
      </Text>
    </Box>
  );
};

export default Album;
