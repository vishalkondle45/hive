import React from 'react';
import { ActionIcon, Badge, Group, Paper, Stack, Text } from '@mantine/core';
import {
  IconCalendar,
  IconCircle,
  IconCircleCheckFilled,
  IconList,
  IconStar,
  IconStarFilled,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import { TodoType } from '@/models/Todo';
import { apiCall } from '@/lib/client_functions';

interface Props {
  todo: TodoType;
  refetch: () => void;
  setSelected?: (todo: TodoType) => void;
}

const Todo = ({ todo, refetch, setSelected }: Props) => {
  const update = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: any) => {
    e.stopPropagation();
    await apiCall('/api/todos', { ...data, _id: todo?._id }, 'PUT');
    refetch();
  };

  return (
    <Paper
      bg={`${todo?.color}.3`}
      p="md"
      key={String(todo?._id)}
      style={{ cursor: 'pointer' }}
      onClick={() => setSelected?.(todo)}
      radius="lg"
    >
      <Stack gap="xs">
        <Group gap="xs" wrap="nowrap" justify="space-between">
          <Group gap="xs" wrap="nowrap">
            <ActionIcon
              color={todo.color ? 'gray.0' : 'dark'}
              variant="transparent"
              onClick={(e) => update(e, { isCompleted: !todo?.isCompleted })}
            >
              {todo?.isCompleted ? <IconCircleCheckFilled /> : <IconCircle />}
            </ActionIcon>
            <Text fw={700} c={todo.color ? 'gray.0' : 'dark'} lineClamp={2}>
              {todo?.todo}
            </Text>
          </Group>
          <ActionIcon
            color={todo.color ? 'gray.0' : 'dark'}
            variant="transparent"
            onClick={(e) => update(e, { isImportant: !todo?.isImportant })}
          >
            {todo?.isImportant ? <IconStarFilled /> : <IconStar />}
          </ActionIcon>
        </Group>
        <Group display={todo?.list || todo?.date ? 'flex' : 'none'}>
          <Badge
            c={todo?.list?.color || 'dark'}
            leftSection={<IconList size={14} />}
            radius="xs"
            variant="white"
            display={todo?.list ? 'flex' : 'none'}
          >
            {todo?.list?.title}
          </Badge>
          <Badge
            c={todo?.list?.color || 'dark'}
            leftSection={<IconCalendar size={14} />}
            radius="xs"
            variant="white"
            display={todo?.date ? 'flex' : 'none'}
          >
            {dayjs(todo?.date).format('DD MMM YYYY')}
          </Badge>
        </Group>
      </Stack>
    </Paper>
  );
};

export default Todo;
