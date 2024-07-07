'use client';

import {
  ActionIcon,
  ActionIconGroup,
  AppShell,
  Badge,
  Box,
  Button,
  Checkbox,
  Group,
  Indicator,
  Modal,
  Paper,
  rem,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { DatePicker, DatePickerInput, DateTimePicker, MonthPickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useDisclosure, useMediaQuery, useViewportSize } from '@mantine/hooks';
import { IconCalendar, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useState } from 'react';
import { apiCall, failure, success } from '@/lib/client_functions';
import useFetchData from '@/hooks/useFetchData';
import { SelectedDay } from '@/components/Calendar';

const CalendarPage = () => {
  const [date, setDate] = useState<Date>(dayjs().startOf('day').toDate());
  const { height } = useViewportSize();
  const [opened, { open, close }] = useDisclosure();
  const [isModalOpened, modalHandlers] = useDisclosure(false);
  const {
    loading,
    data: events,
    refetch,
  } = useFetchData(`/api/events?month=${dayjs(date).format('MMM-YYYY')}`);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1366px)');

  const form = useForm({
    initialValues: {
      title: '',
      from: dayjs(date).set('hour', 9).toDate(),
      to: dayjs(date).set('hour', 10).toDate(),
      isAllDay: false,
    },
    validate: {
      title: (value) => (!value ? 'Title is required' : null),
      from: (value) => (!value ? 'From is required' : null),
      to: (value) => (!value ? 'To is required' : null),
    },
  });

  const handleNewEvent = async (values: typeof form.values) => {
    if (form.values.isAllDay) {
      values.from = dayjs(values.from).startOf('day').toDate();
      values.to = dayjs(values.to).endOf('day').toDate();
    }
    if (dayjs(values.from).isAfter(dayjs(values.to))) {
      failure('From date cannot be after to date');
      return;
    }
    try {
      await apiCall('/api/events', values, 'POST');
      modalHandlers.close();
      form.reset();
      success('Event created successfully');
      refetch();
    } catch (error) {
      failure(String(error));
    }
  };

  const newEvent = () => {
    modalHandlers.open();
    form.setFieldValue('from', dayjs(date).set('hour', 9).toDate());
    form.setFieldValue('to', dayjs(date).set('hour', 10).toDate());
    form.setFieldValue('isAllDay', false);
  };

  const renderDay = (day: Date) => (
    <Box w="100%" p="xs" style={{ cursor: 'pointer' }}>
      <Text fw={dayjs().isSame(day, 'day') ? 900 : 400} ta="right">
        {day.getDate()}
      </Text>
      <Stack gap={rem(4)}>
        {events
          ?.filter((i) => dayjs(i.from).isSame(day, 'day') || dayjs(i.to).isSame(day, 'day'))
          .slice(0, 2)
          .map((event) => (
            <Badge
              variant={dayjs(date).isSame(day, 'day') ? 'filled' : 'outline'}
              color="blue"
              radius={0}
              fullWidth
              key={String(event._id)}
            >
              {event.title}
            </Badge>
          ))}
      </Stack>
      {events?.filter((i) => dayjs(i.from).isSame(day, 'day') || dayjs(i.to).isSame(day, 'day'))
        ?.length > 2 && (
        <Text c={dayjs(date).isSame(day, 'day') ? 'white' : 'blue'} fz="xs">
          {(events?.filter(
            (i) => dayjs(i.from).isSame(day, 'day') || dayjs(i.to).isSame(day, 'day')
          )?.length || 0) - 2}{' '}
          more...
        </Text>
      )}
    </Box>
  );

  const _renderDay = (day: Date) => {
    const noOfEvents = events?.filter(
      (i) => dayjs(i.from).isSame(day, 'day') || dayjs(i.to).isSame(day, 'day')
    ).length;
    return (
      <Indicator
        size={18}
        color="blue"
        offset={-2}
        disabled={!noOfEvents}
        label={noOfEvents}
        processing
      >
        <div>{day.getDate()}</div>
      </Indicator>
    );
  };

  if (loading) return <></>;
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
                size="lg"
                color="gray"
                variant="outline"
                onClick={() => setDate(dayjs(date).subtract(1, 'month').startOf('month').toDate())}
              >
                <IconChevronLeft />
              </ActionIcon>
              <ActionIcon
                size="lg"
                color="gray"
                variant="outline"
                onClick={() => setDate(dayjs().startOf('day').toDate())}
              >
                <IconCalendar />
              </ActionIcon>
              <ActionIcon
                size="lg"
                color="gray"
                variant="outline"
                onClick={() => setDate(dayjs(date).add(1, 'month').startOf('month').toDate())}
              >
                <IconChevronRight />
              </ActionIcon>
            </ActionIconGroup>
            <MonthPickerInput
              value={date}
              onChange={(v) => v && setDate(v)}
              leftSection={
                <IconCalendar color="#000" stroke={2} style={{ width: rem(20), height: rem(20) }} />
              }
              styles={{ input: { fontWeight: 700, whiteSpace: 'nowrap' } }}
            />
          </Group>
          <DatePicker
            date={dayjs(date).toDate()}
            maxLevel="month"
            size="xl"
            mt="md"
            value={date}
            onChange={(v) => {
              if (v) {
                setDate(v);
                open();
              }
            }}
            renderDay={(day) =>
              isMobile || (isTablet && opened) ? _renderDay(day) : renderDay(day)
            }
            styles={{
              month: { width: '100%' },
              monthRow: { width: '100%' },
              day: { width: '100%', height: rem((height * 0.54) / 5), padding: 0 },
              levelsGroup: { minWidth: '100%' },
              calendarHeader: { visibility: 'hidden', display: 'none' },
            }}
          />
        </Paper>
        <Modal opened={isModalOpened} onClose={modalHandlers.close} title="New Event">
          <form onSubmit={form.onSubmit((values) => handleNewEvent(values))}>
            <Stack gap="xs">
              <Group wrap="nowrap" align="center">
                <TextInput
                  type="text"
                  placeholder="Title"
                  w="100%"
                  {...form.getInputProps('title')}
                />
                <Checkbox
                  {...form.getInputProps('isAllDay', { type: 'checkbox' })}
                  style={{ whiteSpace: 'nowrap' }}
                  size="md"
                  label="All day"
                />
              </Group>
              {form.values.isAllDay ? (
                <Group wrap="nowrap">
                  <DatePickerInput
                    label="From"
                    {...form.getInputProps('from')}
                    valueFormat="DD MMM YYYY"
                    w="100%"
                    required
                  />
                  <DatePickerInput
                    label="To"
                    {...form.getInputProps('to')}
                    valueFormat="DD MMM YYYY"
                    w="100%"
                    required
                  />
                </Group>
              ) : (
                <Group wrap="nowrap">
                  <DateTimePicker
                    label="From"
                    {...form.getInputProps('from')}
                    valueFormat="DD MMM YYYY HH:mm"
                    w="100%"
                    required
                  />
                  <DateTimePicker
                    label="To"
                    {...form.getInputProps('to')}
                    valueFormat="DD MMM YYYY HH:mm"
                    w="100%"
                    required
                  />
                </Group>
              )}
              <Button type="submit">Submit</Button>
            </Stack>
          </form>
        </Modal>
      </AppShell.Main>
      <AppShell.Aside p="md">
        <SelectedDay
          date={date}
          close={close}
          setDate={setDate}
          newEvent={newEvent}
          events={events}
        />
      </AppShell.Aside>
    </AppShell>
  );
};

export default CalendarPage;
