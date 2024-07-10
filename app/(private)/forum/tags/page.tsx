'use client';

import React, { useState } from 'react';
import {
  Group,
  rem,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { Tag } from '@/components/Forum';
import useFetchData from '@/hooks/useFetchData';
import Skelton from '@/components/Skelton/Skelton';
import { TagType } from '@/components/Forum/Forum.types';

const TagsPage = () => {
  const [sort, setSort] = useState('popular');
  const [search, setSearch] = useState('');
  const { data, loading } = useFetchData(`/api/forums/tags?sort=${sort}`);
  const router = useRouter();

  return (
    <>
      <Stack>
        <Title>Tags</Title>
        <Text>
          A tag is a keyword or label that categorizes your question with other, similar questions.
          Using the right tags makes it easier for others to find and answer your question.
        </Text>
        <Group justify="space-between">
          <TextInput
            leftSection={<IconSearch style={{ width: rem(18), height: rem(18) }} />}
            placeholder="Filter by tag name"
            w="min-width"
            onChange={(e) => setSearch(e.currentTarget.value)}
            value={search}
          />
          <SegmentedControl
            value={sort}
            onChange={setSort}
            color="indigo"
            bg="white"
            data={[
              { label: 'Popular', value: 'popular' },
              { label: 'Name', value: 'name' },
              { label: 'New', value: 'new' },
            ]}
          />
        </Group>
        <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 4 }}>
          {loading ? (
            <Skelton items={8} height={70} />
          ) : (
            data
              ?.filter((tag: TagType) => String(tag._id).includes(search))
              ?.map((tag: TagType) => (
                <Tag
                  key={String(tag._id)}
                  tag={String(tag._id)}
                  count={tag.total}
                  todayCount={tag.today}
                  onClick={() => router.push(`/forum/tagged/${tag._id}`)}
                />
              ))
          )}
        </SimpleGrid>
      </Stack>
    </>
  );
};

export default TagsPage;
