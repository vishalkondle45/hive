import { Skeleton } from '@mantine/core';
import React from 'react';

const Skelton = ({ items = 4 }: { items?: number }) =>
  [...Array(items)].map((_, i) => <Skeleton key={String(i)} height={100} mt="md" animate />);

export default Skelton;
