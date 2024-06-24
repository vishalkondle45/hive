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
import axios from 'axios';
import React, { useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { nprogress } from '@mantine/nprogress';
import { DatePickerInput } from '@mantine/dates';
import { failure, openModal } from '@/lib/client_functions';
import { COLORS, STYLES } from '@/lib/constants';
import FormButtons from '../FormButtons';

interface Props {
  refetch: () => void;
  getTodoLists: () => void;
  todoList: any[];
  isListPage?: boolean;
}

const TodoPageActions = ({ refetch, getTodoLists, todoList, isListPage = false }: Props) => {
  const ref = useRef<any>();
  const [opened, { open, close }] = useDisclosure(false);
  const [opened1, setOpened1] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [list, setList] = useState({
    _id: '',
    color: '',
    title: '',
  });
  const selected = todoList.find((l) => l._id === pathname.split('/')[2]);

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
    nprogress.start();
    await axios.post('/api/todos', form.values);
    refetch();
    nprogress.complete();
    onClose();
    setOpened1(false);
    getTodoLists();
  };

  const onClose = () => {
    form.reset();
    close();
    setOpened1(false);
  };

  const onDelete = () => {
    openModal(() => {
      axios
        .delete(`/api/todos/todo-list?_id=${pathname.split('/')[2]}`)
        .then(() => {
          form.reset();
          refetch();
          getTodoLists();
          close();
          setOpened1(false);
          router.push('/todos');
        })
        .catch(() => failure('Something went wrong'));
    });
  };

  const createTodoList = () => {
    axios
      .post('/api/todos/todo-list', list)
      .then((res) => {
        form.reset();
        refetch();
        getTodoLists();
        close();
        setOpened1(false);
        router.push(`/todos/${res.data._id}`);
      })
      .catch(() => failure('Something went wrong'));
  };

  return (
    <Group mt="sm" mb="xl" justify="space-between">
      <Text c={selected?.color} tt="capitalize" fw={700}>
        {selected?.title || pathname.split('/')[pathname.split('/').length - 1]}
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
            setList({ _id: '', title: '', color: '' });
            setOpened1(true);
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
                setList({
                  _id: pathname.split('/')[2],
                  title: selected?.title,
                  color: selected?.color,
                });
                setOpened1(true);
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
              data={todoList.map(({ _id, title }) => ({ label: title, value: _id }))}
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
                  color={`${color}.3`}
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
        onClose={() => setOpened1(true)}
        withCloseButton={false}
        bg={list.color}
        p={0}
      >
        <Stack>
          <TextInput
            value={list.title}
            onChange={(e) => setList((old) => ({ ...old, title: e.target.value }))}
            placeholder="Enter list name"
            styles={STYLES}
            onKeyDown={(e) => e.key === 'Enter' && createTodoList()}
          />
          <Group wrap="nowrap" gap={rem(4)} justify="space-between">
            {COLORS?.map((color) => (
              <ActionIcon
                color={`${color}.3`}
                size="sm"
                radius="xl"
                key={color}
                style={{ border: '1px solid gray' }}
                onClick={() =>
                  setList((old) => ({ ...old, color: list.color === color ? '' : color }))
                }
              >
                {color === list.color && <IconCheck stroke={4} style={{ width: rem(14) }} />}
              </ActionIcon>
            ))}
          </Group>
          <Group justify="right">
            <Button color="red" onClick={() => setOpened1(false)}>
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
