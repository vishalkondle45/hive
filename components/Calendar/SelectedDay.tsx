import {
  ActionIcon,
  ActionIconGroup,
  Blockquote,
  Button,
  Group,
  rem,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import {
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
  IconX,
} from '@tabler/icons-react';
import { useMemo, useRef } from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { hoursIcons } from '@/lib/constants';
import { EventDocument } from '@/models/Event';
import { Event } from './Event';

dayjs.extend(isBetween);

interface Props {
  date: Date;
  setDate: (date: Date) => void;
  close: () => void;
  events?: EventDocument[];
  newEvent: (time?: number) => void;
  handleOpenEvent: (event: EventDocument) => void;
}

export const SelectedDay = ({ date, setDate, close, newEvent, events, handleOpenEvent }: Props) => {
  const ref = useRef(null);

  useMemo(() => {
    if (ref.current) {
      (ref.current as any)!.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [date]);

  return (
    <>
      <Group mb="xs" justify="space-between">
        <ActionIcon size="md" color="red" variant="filled" onClick={close}>
          <IconX />
        </ActionIcon>
        <Group style={{ overflow: 'scroll' }} wrap="nowrap">
          <Text fw={700}>{dayjs(date).format('DD MMM YYYY')}</Text>
          <ActionIconGroup>
            <ActionIcon
              size="md"
              variant="outline"
              onClick={() => setDate(dayjs(date).subtract(1, 'day').toDate())}
            >
              <IconChevronLeft />
            </ActionIcon>
            <ActionIcon
              size="md"
              variant="outline"
              onClick={() => setDate(dayjs().startOf('day').toDate())}
            >
              <IconCalendar />
            </ActionIcon>
            <ActionIcon
              size="md"
              variant="outline"
              onClick={() => setDate(dayjs(date).add(1, 'day').toDate())}
            >
              <IconChevronRight />
            </ActionIcon>
          </ActionIconGroup>
        </Group>
        <ActionIconGroup>
          <ActionIcon size="md" color="green" variant="filled" onClick={() => newEvent()}>
            <IconPlus />
          </ActionIcon>
        </ActionIconGroup>
      </Group>
      <Stack gap={rem(4)}>
        {events
          ?.filter(
            (event) =>
              event?.isAllDay &&
              dayjs(date).isBetween(
                dayjs(event?.from).subtract(1, 'day').endOf('day'),
                dayjs(event?.to).add(1, 'day').startOf('day')
              )
          )
          ?.map((event) => (
            <Tooltip
              key={String(event._id)}
              label={`${dayjs(event?.from).format('DD MMM YY')} - ${dayjs(event?.to).format('DD MMM YY')}`}
            >
              <Button
                size="compact-md"
                variant="filled"
                radius={0}
                style={{
                  display: 'flex',
                  position: 'relative',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
                fullWidth
                onClick={() => handleOpenEvent(event)}
                leftSection={<IconCalendar />}
                color={event?.color}
              >
                {event?.title}
              </Button>
            </Tooltip>
          ))
          .reverse()}
      </Stack>
      <ScrollArea.Autosize pt="xs" h="auto" w="100%" viewportRef={ref} mx="auto">
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
                <Tooltip label={`Create event at ${i}:00`}>
                  <ActionIcon
                    variant="filled"
                    color={i > 5 && i < 18 ? 'yellow.7' : 'dark.4'}
                    radius="xl"
                    style={{ zIndex: 2 }}
                    onClick={() => newEvent(i)}
                  >
                    {hoursIcons[i]}
                  </ActionIcon>
                </Tooltip>
              }
            >
              <Group pl="lg" w="100%" wrap="nowrap" gap={0} align="self-start">
                {events
                  ?.filter(
                    (event) =>
                      !event?.isAllDay &&
                      dayjs(event?.from).isSame(dayjs(date).add(i, 'hour'), 'hour')
                  )
                  ?.map((event) => (
                    <Event
                      key={String(event?._id)}
                      event={event}
                      height={dayjs(event?.to).diff(dayjs(event?.from), 'minutes')}
                      maxHeight={(24 - dayjs(event?.from).get('hour')) * 60}
                      title={`${event?.title} | ${dayjs(event?.from).format('HH:mm')} - ${dayjs(event?.to).format('HH:mm')}`}
                      handleOpenEvent={handleOpenEvent}
                    />
                  ))}
                {i === 0 &&
                  events
                    ?.filter(
                      (e) =>
                        !e?.isAllDay &&
                        !dayjs(e?.from).isSame(dayjs(date), 'day') &&
                        dayjs(e?.to).isSame(dayjs(date), 'day')
                    )
                    ?.map((event) => (
                      <Event
                        key={String(event?._id)}
                        event={event}
                        height={dayjs(event?.to).diff(dayjs(date).startOf('day'), 'minutes')}
                        maxHeight={(0 + dayjs(event?.to).get('hour')) * 60}
                        title={`${event?.title} | ${dayjs(event?.from).format('DD MMM YY HH:mm')} - ${dayjs(event?.to).format('DD MMM YY HH:mm')}`}
                        handleOpenEvent={handleOpenEvent}
                      />
                    ))}
              </Group>
            </Blockquote>
          ))}
        </Stack>
      </ScrollArea.Autosize>
    </>
  );
};
