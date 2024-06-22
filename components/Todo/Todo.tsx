import React from 'react';
import { ActionIcon, Badge, Group, Paper, Stack, Text } from '@mantine/core';
import { IconCalendar, IconCircleCheckFilled, IconList, IconStarFilled } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { TodoType } from '@/models/Todo';

interface Props {
  todo: TodoType;
}

const Todo = ({ todo }: Props) => (
  <Paper bg={`${todo?.color}.3`} p="md" key={String(todo?._id)}>
    <Stack gap="xs">
      <Group gap="xs" wrap="nowrap" justify="space-between">
        <Group gap="xs" wrap="nowrap">
          <ActionIcon color="gray.0" variant="transparent">
            <IconCircleCheckFilled />
          </ActionIcon>
          <Text fw={700} c="gray.0" lineClamp={2}>
            {todo?.todo}
          </Text>
        </Group>
        <ActionIcon color="gray.0" variant="transparent">
          <IconStarFilled />
        </ActionIcon>
      </Group>
      <Group display={todo?.list || todo?.date ? 'flex' : 'none'}>
        <Badge
          c={todo?.list?.color || 'dark'}
          leftSection={<IconList size={14} />}
          radius="xs"
          variant="white"
          display={todo?.list ? 'block' : 'none'}
        >
          {todo?.list?.title}
        </Badge>
        <Badge
          c={todo?.list?.color || 'dark'}
          leftSection={<IconCalendar size={14} />}
          radius="xs"
          variant="white"
          display={todo?.date ? 'block' : 'none'}
        >
          {dayjs(todo?.date).format('DD MMM YYYY')}
        </Badge>
      </Group>
    </Stack>
  </Paper>
);

export default Todo;
