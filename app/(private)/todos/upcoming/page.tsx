'use client';

import { useForm } from '@mantine/form';
import {
  ActionIcon,
  AppShell,
  Button,
  Container,
  Group,
  Paper,
  rem,
  Select,
  Stack,
  TextInput,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  IconCaretUpDown,
  IconCheck,
  IconChevronRight,
  IconCircleCheck,
  IconTrash,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { TodoPageActions } from '@/components/Todo';
import TodoSkelton from '@/components/Todo/TodoSkelton';
import useFetchData from '@/hooks/useFetchData';
import { TodoType } from '@/models/Todo';
import Todo from '@/components/Todo/Todo';
import { COLORS, STYLES } from '@/lib/constants';
import { apiCall, failure, openModal } from '@/lib/client_functions';

const TodosPage = () => {
  const { data, refetch, loading } = useFetchData('/api/todos?type=upcoming');
  const [todoList, setTodoList] = useState<any[]>([]);

  const form = useForm({
    initialValues: {
      _id: '',
      todo: '',
      list: '',
      date: null as Date | null | undefined,
      color: 'blue',
    },
    validate: {
      todo: (value) => (value.length ? null : 'Enter todo'),
    },
  });

  const setSelected = (todo: TodoType | null) => {
    form.setValues({
      _id: String(todo?._id) || '',
      todo: todo?.todo || '',
      list: todo?.list?._id ? String(todo?.list?._id) : '',
      date: todo?.date ? new Date(todo?.date) : (undefined as Date | null | undefined),
      color: todo?.color || 'blue',
    });
  };

  const onSubmit = async () => {
    const { _id, todo, list, date, color } = form.values;
    await apiCall('/api/todos', { _id, todo, list: list || null, date, color }, 'PUT').then(() => {
      form.reset();
      refetch();
    });
  };

  const getTodoLists = async () => {
    try {
      const res = await apiCall('/api/todos/todo-list');
      setTodoList(res?.data);
    } catch (error) {
      failure('Something went wrong');
    }
  };

  const onDelete = () => {
    openModal(() => {
      apiCall(`/api/todos?_id=${form.values._id}`, {}, 'DELETE')
        .then(() => {
          form.reset();
          refetch();
        })
        .catch((err) => {
          failure(err.response.data.error || 'Something went wrong');
        });
    });
  };

  useEffect(() => {
    getTodoLists();
  }, []);

  return (
    <AppShell
      aside={{
        width: 400,
        breakpoint: 'sm',
        collapsed: { mobile: !form.values._id, desktop: !form.values._id },
      }}
    >
      <AppShell.Main p={0} mt={rem(-100)} pt={rem(80)}>
        <Container size="sm">
          <TodoPageActions getTodoLists={getTodoLists} todoList={todoList} refetch={refetch} />
          {loading ? (
            <TodoSkelton />
          ) : (
            <Stack>
              {data?.map((todo: TodoType) => (
                <Todo
                  key={String(todo._id)}
                  setSelected={setSelected}
                  refetch={refetch}
                  todo={todo}
                />
              ))}
            </Stack>
          )}
        </Container>
      </AppShell.Main>
      <AppShell.Aside>
        {form.values._id && (
          <Paper px="md">
            <Group my="md" justify="space-between">
              <ActionIcon variant="subtle" radius={0} onClick={() => form.reset()} title="Discard">
                <IconChevronRight />
              </ActionIcon>
              <ActionIcon variant="subtle" color="red" radius={0} title="Delete" onClick={onDelete}>
                <IconTrash />
              </ActionIcon>
            </Group>
            <form onSubmit={form.onSubmit(onSubmit)} onReset={() => form.reset()}>
              <Stack>
                <TextInput
                  {...form.getInputProps('todo')}
                  placeholder="Enter todo"
                  styles={STYLES}
                  rightSection={<IconCircleCheck />}
                />
                <Select
                  {...form.getInputProps('list')}
                  data={todoList?.map(({ _id, title }) => ({ label: title, value: String(_id) }))}
                  placeholder="Select a list (optional)"
                  rightSection={<IconCaretUpDown />}
                  clearable
                  styles={STYLES}
                />
                <DatePickerInput
                  {...form.getInputProps('date')}
                  placeholder="Pick date"
                  styles={STYLES}
                  clearable
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
                <Button type="submit" color="teal" title="Update" fullWidth>
                  Update
                </Button>
              </Stack>
            </form>
          </Paper>
        )}
      </AppShell.Aside>
    </AppShell>
  );
};

export default TodosPage;
