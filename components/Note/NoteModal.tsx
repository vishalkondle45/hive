import { ActionIcon, Group, Modal, Paper, rem, Textarea, TextInput } from '@mantine/core';
import {
  IconArchive,
  IconArchiveOff,
  IconCheck,
  IconPinned,
  IconPinnedOff,
  IconRecycle,
  IconTrash,
  IconTrashX,
} from '@tabler/icons-react';
import { COLORS } from '@/lib/constants';
import { NoteDocument } from '@/models/Note';
import { openModal } from '@/lib/client_functions';

interface Props {
  opened: boolean;
  form: any;
  onSave: (note: NoteDocument) => void;
  onDelete?: (_id: string) => void;
}

export const NoteModal = ({ opened, form, onSave, onDelete = () => {} }: Props) => (
  <Modal
    opened={opened}
    p={0}
    onClose={() => onSave(form.values)}
    withCloseButton={false}
    styles={{ body: { padding: 0 } }}
    centered
  >
    <Paper p="md" bg={form.values.color}>
      <TextInput
        placeholder="Title"
        {...form.getInputProps('title')}
        styles={{
          input: {
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: 20,
            paddingInline: 0,
          },
        }}
        readOnly={form.values.isTrashed}
      />
      <Textarea
        {...form.getInputProps('note')}
        styles={{ input: { backgroundColor: 'transparent', border: 'none', paddingInline: 0 } }}
        placeholder="Take a note..."
        minRows={3}
        autosize
        readOnly={form.values.isTrashed}
      />
      <Group gap="xs" justify="space-between">
        {form.values.isTrashed ? (
          <ActionIcon
            variant="transparent"
            size="sm"
            radius="xl"
            onClick={() =>
              openModal('This note will be deleted permanently', () => onDelete?.(form.values._id))
            }
            color="dark"
            title="Delete permanently"
          >
            <IconTrashX />
          </ActionIcon>
        ) : (
          <Group wrap="nowrap" justify="left" gap="xs">
            {COLORS?.map((color) => (
              <ActionIcon
                color={color}
                size="xs"
                radius="xl"
                key={color}
                style={{ border: '1px solid gray' }}
                onClick={() => {
                  form.setFieldValue('color', color);
                }}
              >
                {color === form.values.color && <IconCheck stroke={4} style={{ width: rem(14) }} />}
              </ActionIcon>
            ))}
            <ActionIcon
              color="gray.0"
              size="xs"
              radius="xl"
              style={{ border: '1px solid gray' }}
              onClick={() => {
                form.setFieldValue('color', 'gray.0');
              }}
            >
              {form.values.color === 'gray.0' && (
                <IconCheck stroke={4} style={{ color: 'black', width: rem(14) }} />
              )}
            </ActionIcon>
          </Group>
        )}
        {form.values._id && (
          <Group gap="xs" align="center" wrap="nowrap">
            <ActionIcon
              variant="transparent"
              size="sm"
              radius="xl"
              onClick={() => onSave({ ...form.values, isTrashed: !form.values.isTrashed })}
              color="dark"
              title={form.values.isTrashed ? 'Restore note' : 'Delete note'}
            >
              {form.values.isTrashed ? <IconRecycle /> : <IconTrash />}
            </ActionIcon>
            {form.values.isTrashed || (
              <>
                {form.values.isArchived || (
                  <ActionIcon
                    variant="transparent"
                    size="sm"
                    radius="xl"
                    onClick={() => onSave({ ...form.values, isPinned: !form.values.isPinned })}
                    color="dark"
                    title={form.values.isPinned ? 'Unpin note' : 'Pin note'}
                  >
                    {form.values.isPinned ? <IconPinnedOff /> : <IconPinned />}
                  </ActionIcon>
                )}
                <ActionIcon
                  variant="transparent"
                  size="sm"
                  radius="xl"
                  onClick={() => onSave({ ...form.values, isArchived: !form.values.isArchived })}
                  color="dark"
                  title={form.values.isArchived ? 'Unarchive note' : 'Archive note'}
                >
                  {form.values.isArchived ? <IconArchiveOff /> : <IconArchive />}
                </ActionIcon>
              </>
            )}
          </Group>
        )}
      </Group>
    </Paper>
  </Modal>
);
