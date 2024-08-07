'use client';

import {
  ActionIcon,
  Button,
  Group,
  Modal,
  rem,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import {
  IconCalendar,
  IconCaretUpDown,
  IconCheck,
  IconCircleCheck,
  IconCursorText,
  IconPlaylistAdd,
  IconPlus,
  IconPrinter,
  IconTrash,
} from '@tabler/icons-react';
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';
import { DatePickerInput } from '@mantine/dates';
import { apiCall, failure, openModal } from '@/lib/client_functions';
import { COLORS, STYLES } from '@/lib/constants';
import FormButtons from '../FormButtons';
import { RootState } from '@/store/store';
import { resetList, setList, setOpened1 } from '@/store/features/todoSlice';

interface Props {
  refetch: () => void;
  getTodoLists: () => void;
  todoList: any[];
  isListPage?: boolean;
}

const TodoPageActions = ({ refetch, getTodoLists, todoList, isListPage = false }: Props) => {
  const ref = useRef<any>();
  const pathname = usePathname();
  const router = useRouter();

  const [opened, { open, close }] = useDisclosure(false);
  const { list, opened1 } = useSelector((state: RootState) => state.todo);
  const dispatch = useDispatch();

  const selected = todoList?.find((l) => l._id === pathname.split('/')[2]);

  const form = useForm({
    initialValues: {
      todo: '',
      list: '',
      date: null,
      color: '',
    },
    validate: {
      todo: (value) => {
        if (value.length === 0) {
          ref.current.focus();
          return 'Please enter a todo';
        }
        return null;
      },
    },
  });

  const onSubmit = async () => {
    if (!form.values.todo) {
      ref.current.focus();
      failure('Please enter a todo');
      return;
    }
    await apiCall('/api/todos', form.values, 'POST');
    refetch();
    onClose();
    dispatch(setOpened1(false));
    getTodoLists();
  };

  const onClose = () => {
    form.reset();
    close();
    dispatch(setOpened1(false));
  };

  const onDelete = () => {
    openModal('This list and its todos will be deleted', () => {
      apiCall(`/api/todos/todo-list?_id=${pathname.split('/')[2]}`, {}, 'DELETE').then(() => {
        form.reset();
        refetch();
        getTodoLists();
        close();
        dispatch(setOpened1(false));
        router.push('/todos');
      });
    });
  };

  const createTodoList = () => {
    apiCall('/api/todos/todo-list', list, 'POST').then((res) => {
      form.reset();
      refetch();
      getTodoLists();
      close();
      dispatch(setOpened1(false));
      router.push(`/todos/${res?.data._id}`);
    });
  };

  return (
    <Group mt="sm" mb="xl" justify="space-between">
      <Text c={selected?.color} tt="capitalize" fw={700}>
        {isListPage ? selected?.title : pathname.split('/')[2] || 'Todos'}
      </Text>
      <Group gap={rem(6)} justify="right">
        <ActionIcon variant="subtle" color="gray" onClick={() => window.print()} title="Print">
          <IconPrinter />
        </ActionIcon>
        <ActionIcon onClick={open} variant="subtle" color="gray" title="Add new todo">
          <IconPlus />
        </ActionIcon>
        <ActionIcon
          variant="subtle"
          color="gray"
          title="Add new list"
          onClick={() => {
            dispatch(resetList());
            dispatch(setOpened1(true));
          }}
        >
          <IconPlaylistAdd />
        </ActionIcon>
        {isListPage && (
          <>
            <ActionIcon
              variant="subtle"
              color="gray"
              title="Rename list"
              onClick={() => {
                dispatch(
                  setList({
                    _id: pathname.split('/')[2],
                    title: selected?.title,
                    color: selected?.color,
                  })
                );
                dispatch(setOpened1(true));
              }}
            >
              <IconCursorText />
            </ActionIcon>
            <ActionIcon variant="subtle" color="gray" title="Delete list" onClick={onDelete}>
              <IconTrash />
            </ActionIcon>
          </>
        )}
      </Group>
      <Modal opened={opened} onClose={onClose} title="New todo" centered>
        <form onSubmit={form.onSubmit(() => onSubmit())} onReset={() => form.reset()}>
          <Stack>
            <TextInput
              {...form.getInputProps('todo')}
              placeholder="Enter todo"
              styles={STYLES}
              rightSection={<IconCircleCheck />}
              ref={ref}
            />
            <Select
              {...form.getInputProps('list')}
              data={todoList?.map(({ _id, title }) => ({ label: title, value: _id }))}
              placeholder="Select a list (optional)"
              rightSection={<IconCaretUpDown />}
              clearable
              styles={STYLES}
            />
            <DatePickerInput
              {...form.getInputProps('date')}
              placeholder="Pick date"
              styles={STYLES}
              rightSection={<IconCalendar />}
            />
            <Group wrap="nowrap" gap={rem(4)} justify="space-between">
              {COLORS?.map((color) => (
                <ActionIcon
                  color={color}
                  size="sm"
                  radius="xl"
                  key={color}
                  style={{ border: '1px solid gray' }}
                  onClick={() =>
                    form.setFieldValue('color', form.values.color === color ? '' : color)
                  }
                >
                  {color === form.values.color && (
                    <IconCheck stroke={4} style={{ width: rem(14) }} />
                  )}
                </ActionIcon>
              ))}
            </Group>
            <FormButtons />
          </Stack>
        </form>
      </Modal>
      <Modal
        opened={opened1}
        onClose={() => dispatch(setOpened1(true))}
        withCloseButton={false}
        bg={list.color}
        p={0}
      >
        <Stack>
          <TextInput
            value={list.title}
            onChange={(e) => setList({ ...list, title: e.target.value })}
            placeholder="Enter list name"
            styles={STYLES}
            onKeyDown={(e) => e.key === 'Enter' && createTodoList()}
          />
          <Group wrap="nowrap" gap={rem(4)} justify="space-between">
            {COLORS?.map((color) => (
              <ActionIcon
                color={color}
                size="sm"
                radius="xl"
                key={color}
                style={{ border: '1px solid gray' }}
                onClick={() =>
                  dispatch(setList({ ...list, color: list.color === color ? '' : color }))
                }
              >
                {color === list.color && <IconCheck stroke={4} style={{ width: rem(14) }} />}
              </ActionIcon>
            ))}
          </Group>
          <Group justify="right">
            <Button color="red" onClick={() => dispatch(setOpened1(false))}>
              Cancel
            </Button>
            <Button color="teal" onClick={() => createTodoList()}>
              Submit
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Group>
  );
};

export default TodoPageActions;
