'use client';

import { useEffect } from 'react';
import { ActionIcon, rem } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { Spotlight, spotlight } from '@mantine/spotlight';
import { IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { APPS } from '@/lib/constants';
import { setSpotlightItems } from '@/store/features/spotlightSlice';
import { RootState } from '@/store/store';
import { apiCall } from '@/lib/client_functions';

export default function SpotLight() {
  const router = useRouter();
  const dispatch = useDispatch();
  const data = useSelector((state: RootState) => state.spotlight.data);

  const getSpotlight = async () => {
    const res = await apiCall('/api/spotlight', null, 'GET');
    dispatch(setSpotlightItems(res?.data));
  };

  useEffect(() => {
    getSpotlight();
  }, []);

  if (!data) {
    return <></>;
  }

  return (
    <>
      <ActionIcon
        variant="outline"
        color="dark"
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
        shortcut={['mod + K', 'mod + F', '/']}
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
