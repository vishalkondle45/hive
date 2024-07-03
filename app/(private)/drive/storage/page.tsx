'use client';

import { useState } from 'react';
import {
  Button,
  Center,
  Container,
  Group,
  Modal,
  Progress,
  RingProgress,
  Text,
} from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import useFetchData from '@/hooks/useFetchData';
import FileTable from '@/components/Drive/FileTable';
import { apiCall, Preview } from '@/lib/client_functions';

const DrivePage = () => {
  const router = useRouter();
  const [preview, setPreview] = useState('');
  const { data } = useFetchData('/api/drive/storage', () => router.push('/drive'));
  const total = 1024 * 1024 * 10;
  const used = data?.used;
  const percentage = (used / total) * 100;

  const getFile = async (Key: string) => {
    const res = await apiCall(`/api/drive/files/upload?Key=${encodeURI(Key)}`);
    setPreview(res?.data);
  };

  return (
    <Container px={0} size="xs">
      <Group mb="md" justify="space-between">
        <Breadcrumbs
          path={[
            { name: 'Drive', _id: '' },
            { name: 'Storage', _id: 'storage' },
          ]}
        />
      </Group>
      <Progress value={percentage} striped />
      <Text fw={600} ta="right">
        {(used / 1024 / 1024).toFixed(2)} /{' '}
        <Text fw={600} span>
          {total / 1024 / 1024} MB
        </Text>
      </Text>
      <Center>
        <RingProgress
          size={120}
          thickness={12}
          roundCaps
          sections={[{ value: percentage, color: percentage >= 10 ? 'red' : 'teal' }]}
          label={
            <Text size="xs" ta="center" px="xs" style={{ pointerEvents: 'none' }}>
              {percentage.toFixed(2)}%
            </Text>
          }
        />
      </Center>
      <FileTable
        data={data?.largestTen}
        openFile={(item) => getFile(item?.link)}
        withDate={false}
      />
      <Modal
        size="auto"
        centered
        opened={!!preview}
        onClose={() => setPreview('')}
        title={
          <Button
            onClick={() => window.open(preview, '_blank', 'noopener,noreferrer')}
            color="teal"
            leftSection={<IconDownload size={16} />}
          >
            Download
          </Button>
        }
      >
        {Preview(preview)}
      </Modal>
    </Container>
  );
};

export default DrivePage;
