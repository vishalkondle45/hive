import { Button, Paper, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { nprogress } from '@mantine/nprogress';
import Document from '../Document';
import { apiCall, failure } from '@/lib/client_functions';

interface Props {
  parent: string;
  refetch: () => void;
}

export const ReplyToQuestion = ({ parent, refetch }: Props) => {
  const form = useForm({
    initialValues: {
      description: '',
    },
    validate: {
      description: (value) => (value.length < 1 ? 'This field is required' : null),
    },
  });

  const onSubmit = async () => {
    try {
      nprogress.start();
      await apiCall('/api/forums/reply', { description: form.values.description, parent }, 'POST');
      form.reset();
      refetch();
    } catch (error: any) {
      failure(error);
    } finally {
      nprogress.complete();
    }
  };

  return (
    <Paper p="lg" withBorder>
      <Text fw={700} mb="lg">
        Your Answer
      </Text>
      <Document
        content={form.values.description}
        onUpdate={(str) => form.setFieldValue('description', str)}
        isDocumentPage={false}
      />
      <Button mt="lg" onClick={onSubmit}>
        Post You Answer
      </Button>
    </Paper>
  );
};
