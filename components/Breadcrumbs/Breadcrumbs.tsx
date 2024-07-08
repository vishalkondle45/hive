import { Anchor, Loader, Breadcrumbs as _Breadcrumbs } from '@mantine/core';
import Link from 'next/link';
import React from 'react';

const Breadcrumbs = ({ path }: { path: any }) => {
  if (!path) return <Loader size="xs" />;
  return (
    <_Breadcrumbs style={{ flexWrap: 'wrap' }} separator="→">
      {path?.map((item: any) => (
        <Anchor
          variant="transparent"
          component={Link}
          href={`/drive${item?._id ? `?_id=${item?._id}` : ''}`}
          key={String(item?._id)}
          fw={700}
        >
          {item?.name}
        </Anchor>
      ))}
    </_Breadcrumbs>
  );
};

export default Breadcrumbs;
