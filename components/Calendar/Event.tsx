import { Button } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import React from 'react';
import { EventDocument } from '@/models/Event';

interface Props {
  event: EventDocument;
  height: number;
  maxHeight: number;
  title: string;
}

export const Event = ({ event, height, maxHeight, title }: Props) => (
  <Button
    key={String(event._id)}
    variant="light"
    radius={0}
    style={{
      //   display: 'flex',
      position: 'relative',
      cursor: 'pointer',
      zIndex: 1,
      whiteSpace: 'pre-wrap',
    }}
    fullWidth
    onClick={() => {}}
    title={title}
    leftSection={<IconClock />}
    mih={15}
    h={height}
    mah={maxHeight}
  >
    {event?.title}
  </Button>
);
