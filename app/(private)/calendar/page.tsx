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
  Select,
  SelectProps,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
} from '@mantine/core';
import { DatePicker, DatePickerInput, DateTimePicker, MonthPickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useDisclosure, useMediaQuery, useViewportSize } from '@mantine/hooks';
import {
  IconCalendar,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconTagFilled,
  IconTrash,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useState } from 'react';
import { apiCall, failure, openModal, success } from '@/lib/client_functions';
import useFetchData from '@/hooks/useFetchData';
import { SelectedDay } from '@/components/Calendar';
import { COLORS } from '@/lib/constants';
import { EventDocument } from '@/models/Event';

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
      _id: '',
      title: '',
      from: dayjs(date).set('hour', 9).toDate(),
      to: dayjs(date).set('hour', 10).toDate(),
      isAllDay: false,
      color: 'blue',
    },
    validate: {
      title: (value) => (!value ? 'Title is required' : null),
      from: (value) => (!value ? 'From is required' : null),
      to: (value) => (!value ? 'To is required' : null),
    },
  });

  const handleEvent = async (values: typeof form.values) => {
    if (form.values.isAllDay) {
      values.from = dayjs(values.from).startOf('day').toDate();
      values.to = dayjs(values.to).endOf('day').toDate();
    }
    if (dayjs(values.from).isAfter(dayjs(values.to))) {
      failure('From date cannot be after to date');
      return;
    }
    try {
      if (form.values._id) {
        await apiCall('/api/events', values, 'PUT');
      } else {
        const { _id, ...rest } = values;
        await apiCall('/api/events', rest, 'POST');
      }
      modalHandlers.toggle();
      form.reset();
      success('Event created successfully');
      refetch();
    } catch (error) {
      failure(String(error));
    }
  };

  const newEvent = (time?: number) => {
    form.reset();
    if (time !== undefined) {
      form.setFieldValue('from', dayjs(date).set('hour', time).toDate());
      form.setFieldValue(
        'to',
        dayjs(date)
          .set('hour', time + 1)
          .toDate()
      );
    } else {
      form.setFieldValue('from', dayjs(date).set('hour', 9).toDate());
      form.setFieldValue('to', dayjs(date).set('hour', 10).toDate());
    }
    modalHandlers.toggle();
  };

  const handleOpenEvent = (event: EventDocument) => {
    form.reset();
    form.setFieldValue('from', dayjs(event.from).set('hour', 9).toDate());
    form.setFieldValue('to', dayjs(event.to).set('hour', 10).toDate());
    form.setFieldValue('isAllDay', event.isAllDay);
    form.setFieldValue('title', event.title);
    form.setFieldValue('color', event.color);
    form.setFieldValue('_id', String(event?._id));
    modalHandlers.toggle();
  };

  const handleDeleteEvent = () => {
    openModal('Do you want to delete this event?', async () => {
      try {
        await apiCall(`/api/events?_id=${form.values._id}`, null, 'DELETE');
        success('Event deleted successfully');
        refetch();
        modalHandlers.toggle();
      } catch (error) {
        failure(String(error) || 'Something went wrong');
      }
    });
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
              variant={dayjs(date).isSame(day, 'day') ? 'white' : 'filled'}
              color={event?.color}
              radius={0}
              key={String(event._id)}
              style={{ flex: 1, justifyContent: 'left' }}
              fullWidth
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
        color="dark"
        offset={-2}
        disabled={!noOfEvents}
        label={noOfEvents}
        processing
        zIndex={0}
      >
        <Text fw={dayjs().isSame(day, 'day') ? 900 : 400}>{day.getDate()}</Text>
      </Indicator>
    );
  };

  const renderSelectOption: SelectProps['renderOption'] = ({ option, checked }) => (
    <Group flex="1" gap="xs">
      <ThemeIcon variant="transparent" color={option.value} size="xs">
        <IconTagFilled />
      </ThemeIcon>
      {option.label}
      {checked && <IconCheck style={{ marginInlineStart: 'auto' }} />}
    </Group>
  );

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
                variant="outline"
                onClick={() => setDate(dayjs(date).subtract(1, 'month').startOf('month').toDate())}
              >
                <IconChevronLeft />
              </ActionIcon>
              <ActionIcon
                size="lg"
                variant="outline"
                onClick={() => setDate(dayjs().startOf('day').toDate())}
              >
                <IconCalendar />
              </ActionIcon>
              <ActionIcon
                size="lg"
                variant="outline"
                onClick={() => setDate(dayjs(date).add(1, 'month').startOf('month').toDate())}
              >
                <IconChevronRight />
              </ActionIcon>
            </ActionIconGroup>
            <MonthPickerInput
              variant="filled"
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
              day: { width: '100%', height: rem((height * 0.65) / 5), padding: 0 },
              levelsGroup: { minWidth: '100%' },
              calendarHeader: { visibility: 'hidden', display: 'none' },
            }}
          />
        </Paper>
        <Modal
          opened={isModalOpened}
          onClose={() => {
            modalHandlers.toggle();
            form.reset();
          }}
          title={form.values?._id ? 'Edit Event' : 'New Event'}
        >
          <form onSubmit={form.onSubmit((values) => handleEvent(values))}>
            <Stack gap="xs">
              <TextInput
                type="text"
                placeholder="Title"
                w="100%"
                {...form.getInputProps('title')}
              />
              <Group justify="space-between" wrap="nowrap" align="center">
                <Checkbox
                  {...form.getInputProps('isAllDay', { type: 'checkbox' })}
                  style={{ whiteSpace: 'nowrap' }}
                  size="md"
                  label="All day"
                />
                <Group wrap="nowrap" gap="xs">
                  <ThemeIcon variant="transparent" color={form.values.color} size="sm">
                    <IconTagFilled />
                  </ThemeIcon>
                  <Select
                    placeholder="Select color"
                    data={COLORS}
                    renderOption={renderSelectOption}
                    styles={{
                      input: { textTransform: 'capitalize' },
                      option: { textTransform: 'capitalize' },
                    }}
                    {...form.getInputProps('color')}
                    allowDeselect={false}
                  />
                </Group>
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
              <Group wrap="nowrap">
                <Button fullWidth type="submit">
                  Submit
                </Button>
                {form.values?._id && (
                  <ActionIcon size="lg" color="red">
                    <IconTrash onClick={handleDeleteEvent} />
                  </ActionIcon>
                )}
              </Group>
            </Stack>
          </form>
        </Modal>
      </AppShell.Main>
      <AppShell.Aside zIndex={1} p="md">
        <SelectedDay
          date={date}
          close={close}
          setDate={setDate}
          newEvent={newEvent}
          events={events}
          handleOpenEvent={handleOpenEvent}
        />
      </AppShell.Aside>
    </AppShell>
  );
};

export default CalendarPage;
