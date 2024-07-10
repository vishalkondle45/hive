import { Skeleton } from '@mantine/core';
import React from 'react';

const Skelton = ({ items = 4, height = 100 }: { items?: number; height?: number }) =>
  [...Array(items)].map((_, i) => <Skeleton key={String(i)} height={height} mt="md" animate />);

export default Skelton;
