'use client';

import { ActionIcon, Group, Modal, rem, Select, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import {
  IconCalendar,
  IconCaretUpDown,
  IconCheck,
  IconCircleCheck,
  IconPlus,
  IconPrinter,
  IconShare,
} from '@tabler/icons-react';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { nprogress } from '@mantine/nprogress';
import { DatePickerInput } from '@mantine/dates';
import { failure } from '@/lib/client_functions';
import { COLORS } from '@/lib/constants';
import FormButtons from '../FormButtons';

const STYLES = {
  input: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: 16,
    paddingInline: 0,
    fontWeight: 'bold',
  },
};

interface Props {
  refetch: () => void;
}

const TodoPageActions = ({ refetch }: Props) => {
  const ref = useRef<any>();
  const [opened, { open, close }] = useDisclosure(false);
  const [todoList, setTodoList] = useState([]);

  const form = useForm({
    initialValues: {
      todo: '',
      list: '',
      date: null,
      color: 'blue',
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

  const getTodoLists = async () => {
    try {
      const res = await axios.get('/api/todos/todo-list');
      setTodoList(res?.data);
    } catch (error) {
      failure('Something went wrong');
    }
  };

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
    getTodoLists();
  };

  const onClose = () => {
    form.reset();
    close();
  };

  useEffect(() => {
    getTodoLists();
  }, []);

  return (
    <>
      <Group mt="sm" mb="xl" justify="right">
        <ActionIcon variant="subtle" color="gray" onClick={() => window.print()}>
          <IconPrinter />
        </ActionIcon>
        <ActionIcon variant="subtle" color="gray">
          <IconShare />
        </ActionIcon>
        <ActionIcon onClick={open} variant="subtle" color="gray">
          <IconPlus />
        </ActionIcon>
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
    </>
  );
};

export default TodoPageActions;
