import React from 'react';
import { ActionIcon, Badge, Group, Paper, Stack, Text } from '@mantine/core';
import { IconCalendar, IconCircleCheckFilled, IconList, IconStarFilled } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { TodoType } from '@/models/Todo';

interface Props {
  todos: TodoType[];
}

const Todos = ({ todos }: Props) => (
  <Stack>
    {todos?.map((i: TodoType) => (
      <Paper bg={`${i.color}.3`} p="md" key={String(i._id)}>
        <Stack gap="xs">
          <Group gap="xs" wrap="nowrap" justify="space-between">
            <Group gap="xs" wrap="nowrap">
              <ActionIcon color="gray.0" variant="transparent">
                <IconCircleCheckFilled />
              </ActionIcon>
              <Text fw={700} c="gray.0" lineClamp={2}>
                {i.todo}
              </Text>
            </Group>
            <ActionIcon color="gray.0" variant="transparent">
              <IconStarFilled />
            </ActionIcon>
          </Group>
          <Group display={i?.list || i?.date ? 'flex' : 'none'}>
            <Badge
              c={i?.list?.color || 'dark'}
              leftSection={<IconList size={14} />}
              radius="xs"
              variant="white"
              display={i?.list ? 'block' : 'none'}
            >
              {i?.list?.title}
            </Badge>
            <Badge
              c={i?.list?.color || 'dark'}
              leftSection={<IconCalendar size={14} />}
              radius="xs"
              variant="white"
              display={i?.date ? 'block' : 'none'}
            >
              {dayjs(i?.date).format('DD MMM YYYY')}
            </Badge>
          </Group>
        </Stack>
      </Paper>
    ))}
  </Stack>
);

export default Todos;
