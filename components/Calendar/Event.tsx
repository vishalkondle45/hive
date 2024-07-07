import { Button, Tooltip } from '@mantine/core';
import React from 'react';
import { EventDocument } from '@/models/Event';

interface Props {
  event: EventDocument;
  height: number;
  maxHeight: number;
  title: string;
  handleOpenEvent: (event: EventDocument) => void;
}

export const Event = ({ event, height, maxHeight, title, handleOpenEvent }: Props) => (
  <Tooltip key={String(event._id)} label={title}>
    <Button
      variant="filled"
      bd="0.2px solid white"
      radius={0}
      style={{
        display: 'flex',
        position: 'relative',
        cursor: 'pointer',
        zIndex: 1,
        whiteSpace: 'pre-wrap',
      }}
      fullWidth
      onClick={(e) => {
        e.stopPropagation();
        handleOpenEvent(event);
      }}
      mih={15}
      h={height}
      mah={maxHeight}
      color={event?.color}
      w="fit-content"
      maw={200}
    >
      {event?.title}
    </Button>
  </Tooltip>
);
