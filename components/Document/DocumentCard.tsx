import React, { useState } from 'react';
import { ActionIcon, Button, Card, Group, Popover, rem, Stack, Text } from '@mantine/core';
import {
  IconCursorText,
  IconDotsVertical,
  IconExternalLink,
  IconRestore,
  IconTrash,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useHover } from '@mantine/hooks';
import { DocumentType } from '@/models/Document';

interface Props {
  doc: DocumentType;
  goTo: (_id: string) => void;
  onRename: (_id: string, title: string) => void;
  updateDocument: (updatedData: any) => Promise<void>;
}

export const DocumentCard = ({ doc, goTo, onRename, updateDocument }: Props) => {
  const [opened, setOpened] = useState(false);
  const { hovered, ref } = useHover();
  return (
    <Card
      onClick={() => goTo(String(doc?._id))}
      style={{ cursor: 'pointer' }}
      h={rem(400)}
      key={String(String(doc?._id))}
      ref={ref}
      shadow={hovered ? 'xl' : ''}
    >
      <Card.Section p="xs" style={{ overflow: 'hidden' }} h={rem(350)}>
        <Text fz={rem(6)} dangerouslySetInnerHTML={{ __html: doc?.content }} />
      </Card.Section>
      <Stack gap={0}>
        <Text mt="xs" size="sm">
          {doc?.title}
        </Text>
        <Group justify="space-between" align="center">
          <Text mt="xs" c="dimmed" size="sm">
            Opened{' '}
            {dayjs(doc?.updatedAt).format(
              dayjs().isSame(doc?.updatedAt, 'day') ? 'HH:mm A' : 'MMM, D, YYYY'
            )}
          </Text>
          {doc?.isTrashed ? (
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={(e) => {
                e.stopPropagation();
                updateDocument({ _id: String(doc?._id), isTrashed: false });
              }}
            >
              <IconRestore style={{ width: rem(18), height: rem(18) }} />
            </ActionIcon>
          ) : (
            <Popover opened={opened} onChange={setOpened}>
              <Popover.Target>
                <ActionIcon
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpened(!opened);
                  }}
                  variant="subtle"
                  color="gray"
                  radius="xl"
                >
                  <IconDotsVertical />
                </ActionIcon>
              </Popover.Target>
              <Popover.Dropdown p={0}>
                <Stack gap={0}>
                  <Button
                    leftSection={<IconCursorText style={{ width: rem(18), height: rem(18) }} />}
                    variant="subtle"
                    radius={0}
                    color="gray"
                    justify="left"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRename(String(doc?._id), doc?.title);
                      setOpened(false);
                    }}
                  >
                    Rename
                  </Button>
                  <Button
                    leftSection={<IconTrash style={{ width: rem(18), height: rem(18) }} />}
                    variant="subtle"
                    radius={0}
                    color="gray"
                    justify="left"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateDocument({ _id: String(doc?._id), isTrashed: true });
                    }}
                  >
                    Trash
                  </Button>
                  <Button
                    leftSection={<IconExternalLink style={{ width: rem(18), height: rem(18) }} />}
                    variant="subtle"
                    radius={0}
                    color="gray"
                    component="a"
                    target="_blank"
                    href={`/documents/${doc?._id}`}
                    justify="left"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Open in new tab
                  </Button>
                </Stack>
              </Popover.Dropdown>
            </Popover>
          )}
        </Group>
      </Stack>
    </Card>
  );
};
