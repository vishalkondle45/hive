import { Button, Group, Modal, Stack, TagsInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { nprogress } from '@mantine/nprogress';
import { IconTags } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import Document from '../Document';
import { apiCall, failure } from '@/lib/client_functions';

interface Props {
  opened: boolean;
  close: () => void;
}

export const AskQuestion = ({ opened, close }: Props) => {
  const router = useRouter();

  const form = useForm({
    initialValues: {
      question: '',
      description: '',
      tags: [],
    },
    validate: {
      question: (value) => (value.length < 1 ? 'This field is required' : null),
      description: (value) => (value.length < 1 ? 'This field is required' : null),
      tags: (value) => (value.length < 1 ? 'Atleast one tag is required' : null),
    },
  });

  const onClose = () => {
    form.reset();
    close();
  };

  const onSubmit = async (values: typeof form.values) => {
    try {
      nprogress.start();
      await apiCall('/api/forums', values, 'POST').then((res) => {
        form.reset();
        close();
        router.push(`/forum/${res?.data._id}`);
      });
    } catch (error: any) {
      failure(error);
    } finally {
      nprogress.complete();
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Ask Question" size="100%">
      <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
        <Stack>
          <TextInput
            label="Question"
            placeholder="Question Title"
            {...form.getInputProps('question')}
            withAsterisk
          />
          <Document
            placeholder="Write your question here..."
            content={form.values.description}
            onUpdate={(description) => form.setFieldValue('description', description)}
            isDocumentPage={false}
          />
          <TagsInput
            leftSection={<IconTags />}
            label="Enter tag"
            placeholder="Enter tags"
            {...form.getInputProps('tags')}
          />
          <Group justify="right">
            <Button color="red" onClick={onClose}>
              Close
            </Button>
            <Button color="teal" type="submit">
              Submit
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
