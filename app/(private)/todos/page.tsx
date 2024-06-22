'use client';

import { Stack } from '@mantine/core';
import { TodoPageActions } from '@/components/Todo';
import TodoSkelton from '@/components/Todo/TodoSkelton';
import useFetchData from '@/hooks/useFetchData';
import { TodoType } from '@/models/Todo';
import Todo from '@/components/Todo/Todo';

const TodosPage = () => {
  const { data, refetch, loading } = useFetchData('/api/todos');
  return (
    <>
      <TodoPageActions refetch={refetch} />
      {loading ? (
        <TodoSkelton />
      ) : (
        <Stack>{data?.map((todo: TodoType) => <Todo todo={todo} />)}</Stack>
      )}
    </>
  );
};

export default TodosPage;
