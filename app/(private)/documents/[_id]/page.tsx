'use client';

import React, { useEffect, useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { ActionIcon, Group, Loader, rem, Text, TextInput, ThemeIcon } from '@mantine/core';
import { IconCloudCheck, IconStar, IconStarFilled, IconTrash } from '@tabler/icons-react';
import Document from '@/components/Document';
import { STYLES } from '@/lib/constants';
import { apiCall } from '@/lib/client_functions';

const DocumentPage = ({ params }: { params: { _id: string } }) => {
  const [syncing, setSyncing] = useState(false);
  const [data, setData] = useState({
    _id: '',
    title: '',
    content: '',
    isImportant: false,
    isTrashed: false,
  });

  const [debounced] = useDebouncedValue(data, 500);

  const getDocument = async (_id: string) => {
    const res = await apiCall(`/api/documents?_id=${_id}`);
    setData(res?.data);
  };

  const updateDocument = async (updatedData: any) => {
    setSyncing(true);
    await apiCall('/api/documents', updatedData, 'PUT');
    setSyncing(false);
  };

  useEffect(() => {
    if (params?._id && debounced?._id) {
      updateDocument(debounced);
    }
  }, [debounced]);

  useEffect(() => {
    if (params?._id) {
      getDocument(params?._id);
    }
  }, [params?._id]);

  if (!data?._id) {
    return <></>;
  }
  return (
    <>
      <Group mb="md">
        <TextInput
          styles={STYLES}
          value={data?.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
          placeholder="Title"
          onBlur={() =>
            setData({ ...data, title: data?.title ? data?.title.trim() : 'Untitled Document' })
          }
          miw={rem(200)}
          w={rem((data.title.length + 1) * 9)}
        />
        <ActionIcon
          size="sm"
          variant="transparent"
          onClick={() => setData({ ...data, isImportant: !data?.isImportant })}
          color="yellow"
        >
          {data?.isImportant ? <IconStarFilled /> : <IconStar />}
        </ActionIcon>
        <ActionIcon
          size="sm"
          variant="transparent"
          onClick={() => setData({ ...data, isTrashed: !data?.isTrashed })}
          color="red"
        >
          <IconTrash />
        </ActionIcon>
        {syncing ? (
          <Group>
            <Loader size="xs" color="green" />
            <Text size="xs" c="green">
              Syncing...
            </Text>
          </Group>
        ) : (
          <ThemeIcon size="sm" variant="transparent" color="teal">
            <IconCloudCheck />
          </ThemeIcon>
        )}
        <Group gap="xs"></Group>
      </Group>
      <Document content={data?.content} onUpdate={(content) => setData({ ...data, content })} />
    </>
  );
};

export default DocumentPage;
