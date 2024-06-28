'use client';

import { ActionIcon, rem } from '@mantine/core';
import { Spotlight, spotlight } from '@mantine/spotlight';
import { IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import useFetchData from '@/hooks/useFetchData';
import { APPS } from '@/lib/constants';

export default function SpotLight() {
  const { data } = useFetchData('/api/spotlight');
  const router = useRouter();

  if (!data) {
    return <></>;
  }

  return (
    <>
      <ActionIcon
        variant="light"
        color="gray"
        radius="xl"
        size={rem(40)}
        onClick={spotlight.open}
        title="Ctrl + K"
      >
        <IconSearch stroke={3} style={{ width: rem(20), height: rem(20) }} />
      </ActionIcon>
      <Spotlight
        nothingFound="Nothing found..."
        highlightQuery
        limit={7}
        shortcut="mod + K"
        searchProps={{
          leftSection: <IconSearch style={{ width: rem(20), height: rem(20) }} stroke={1.5} />,
          placeholder: 'Search...',
        }}
        actions={data
          .filter((item: any) => item.label !== '' || item.description !== '')
          ?.map((item: any) => ({
            ...item,
            leftSection: APPS.find((app) => app.path === item.id)?.icon,
            onClick: () => router.push(item.id),
            type: undefined,
          }))}
      />
    </>
  );
}
