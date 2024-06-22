import { Skeleton } from '@mantine/core';
import React from 'react';

const TodoSkelton = () =>
  [...Array(4)].map((_, i) => <Skeleton key={String(i)} height={100} mt="md" animate />);

export default TodoSkelton;
