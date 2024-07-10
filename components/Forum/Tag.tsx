import { Badge, Group, Paper, Stack, Text } from '@mantine/core';
import React from 'react';

interface Props {
  tag: string;
  onClick: () => void;
  count: number;
  todayCount?: number;
}

export const Tag = ({ tag, onClick, count, todayCount }: Props) => (
  <Paper p="md" withBorder>
    <Stack>
      <Badge style={{ cursor: 'pointer' }} onClick={onClick} radius="xs" tt="lowercase">
        {tag}
      </Badge>
      <Group wrap="nowrap" justify="space-between">
        <Text size="xs" c="dimmed">
          {count} questions
        </Text>
        <Text size="xs" c="dimmed">
          {todayCount} asked today
        </Text>
      </Group>
    </Stack>
  </Paper>
);
