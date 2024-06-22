'use client';

import { TodoPageActions } from '@/components/Todo';
import Todos from '@/components/Todo/Todo';
import TodoSkelton from '@/components/Todo/TodoSkelton';
import useFetchData from '@/hooks/useFetchData';

const TodosPage = () => {
  const { data, refetch, loading } = useFetchData('/api/todos');
  return (
    <>
      <TodoPageActions refetch={refetch} />
      {loading ? <TodoSkelton /> : <Todos todos={data} />}
    </>
  );
};

export default TodosPage;
