'use client';

import {
  ActionIcon,
  ActionIconGroup,
  AppShell,
  Blockquote,
  Button,
  Group,
  Paper,
  rem,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { DatePicker, MonthPickerInput } from '@mantine/dates';
import { useDisclosure, useViewportSize } from '@mantine/hooks';
import { IconCalendar, IconChevronLeft, IconChevronRight, IconX } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useState } from 'react';
import { hoursIcons } from '@/lib/constants';

const Page = () => {
  const { height } = useViewportSize();
  const [value, setValue] = useState<Date>(dayjs().startOf('day').toDate());
  const [opened, { open, close }] = useDisclosure();

  const [events] = useState([
    {
      id: 1,
      event: 'Event 1',
      from: '07-05-2024 0:00',
      to: '07-05-2024 1:20',
      color: 'blue',
    },
    {
      id: 1,
      event: 'Event 1',
      from: '07-06-2024 00:00',
      to: '07-06-2024 2:20',
      color: 'red',
    },
  ]);

  return (
    <AppShell
      aside={{
        width: 400,
        breakpoint: 'sm',
        collapsed: { mobile: !opened, desktop: !opened },
      }}
      padding="xs"
    >
      <AppShell.Main p={0} mih={rem(height * 0.54)}>
        <Paper p="sm" withBorder>
          <Group wrap="nowrap">
            <ActionIconGroup>
              <ActionIcon
                radius="50%"
                size="lg"
                color="gray"
                variant="outline"
                onClick={() => setValue(dayjs(value).subtract(1, 'month').toDate())}
              >
                <IconChevronLeft />
              </ActionIcon>
              <ActionIcon
                radius="50%"
                size="lg"
                color="gray"
                variant="outline"
                onClick={() => setValue(dayjs().startOf('day').toDate())}
              >
                <IconCalendar />
              </ActionIcon>
              <ActionIcon
                radius="50%"
                size="lg"
                color="gray"
                variant="outline"
                onClick={() => setValue(dayjs(value).add(1, 'month').toDate())}
              >
                <IconChevronRight />
              </ActionIcon>
            </ActionIconGroup>
            <MonthPickerInput
              value={value}
              onChange={(v) => v && setValue(v)}
              leftSection={
                <IconCalendar color="#000" stroke={2} style={{ width: rem(20), height: rem(20) }} />
              }
              styles={{ input: { fontWeight: 700 } }}
              radius="xl"
            />
            <Text>{JSON.stringify(value)}</Text>
          </Group>
          <DatePicker
            date={dayjs(value).toDate()}
            maxLevel="month"
            size="xl"
            mt="md"
            value={value}
            onChange={(v) => {
              if (v) {
                setValue(v);
                open();
              }
            }}
            styles={{
              month: { width: '100%' },
              monthRow: { width: '100%' },
              day: { width: '100%', height: rem((height * 0.54) / 5) },
              levelsGroup: { minWidth: '100%' },
              calendarHeader: { visibility: 'hidden', display: 'none' },
            }}
          />
        </Paper>
      </AppShell.Main>
      <AppShell.Aside p="md">
        <Group my="xs" justify="space-between">
          <ActionIcon size="lg" color="red" variant="transparent" onClick={close}>
            <IconX />
          </ActionIcon>
          <Text fw={700}>{dayjs(value).format('DD MMM YYYY')}</Text>
          <ActionIconGroup>
            <ActionIcon
              size="lg"
              color="gray"
              variant="outline"
              onClick={() => setValue(dayjs(value).subtract(1, 'day').toDate())}
              radius="50%"
            >
              <IconChevronLeft />
            </ActionIcon>
            <ActionIcon
              size="lg"
              color="gray"
              variant="outline"
              onClick={() => setValue(dayjs().startOf('day').toDate())}
              radius="50%"
            >
              <IconCalendar />
            </ActionIcon>
            <ActionIcon
              size="lg"
              color="gray"
              variant="outline"
              onClick={() => setValue(dayjs(value).add(1, 'day').toDate())}
              radius="50%"
            >
              <IconChevronRight />
            </ActionIcon>
          </ActionIconGroup>
        </Group>
        <ScrollArea.Autosize h="auto">
          <Stack pt="md" gap={0}>
            {new Array(24).fill(0).map((_, i) => (
              <Blockquote
                key={i}
                color="white"
                iconSize={24}
                p={0}
                style={{ border: '1px solid #EFF3F7' }}
                h={60}
                radius={0}
                ml="md"
                icon={
                  <ThemeIcon
                    variant="filled"
                    color={i > 5 && i < 18 ? 'orange' : 'dark'}
                    radius="xl"
                    autoContrast
                  >
                    {hoursIcons[i]}
                  </ThemeIcon>
                }
              >
                <Group wrap="nowrap" gap={0} align="self-start">
                  {events
                    .filter((e) => dayjs(e.from).isSame(dayjs(value).add(i, 'hour'), 'hour'))
                    .map((e, id) => (
                      <Button
                        key={String(id)}
                        variant="light"
                        radius={0}
                        h={dayjs(e.to).diff(dayjs(e.from), 'minutes')}
                        style={{
                          display: 'flex',
                          position: 'relative',
                          textAlign: 'left',
                          cursor: 'pointer',
                          zIndex: 1,
                          justifyContent: 'left',
                          alignItems: 'end',
                        }}
                        ta="left"
                        fullWidth
                        color={e.color}
                        onClick={() => {}}
                        autoContrast
                      >
                        {e.event}
                      </Button>
                    ))}
                </Group>
              </Blockquote>
            ))}
          </Stack>
        </ScrollArea.Autosize>
      </AppShell.Aside>
    </AppShell>
  );
};

export default Page;
