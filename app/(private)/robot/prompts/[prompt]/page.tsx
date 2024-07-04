'use client';

import { CodeHighlight } from '@mantine/code-highlight';
import {
  ActionIcon,
  Box,
  Container,
  CopyButton,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { nprogress } from '@mantine/nprogress';
import {
  IconCheck,
  IconClipboard,
  IconPencil,
  IconPlayerStopFilled,
  IconReload,
  IconVolume,
} from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NewPrompt } from '@/components/Robot';
import { apiCall, renderBoldText, textToSpeech } from '@/lib/client_functions';
import { setResponse } from '@/store/features/robotSlice';
import { RootState } from '@/store/store';

const CodeRenderer = ({ text }: { text: string }) => {
  const codeRegex = /```([\s\S]*?)```/g;
  return text.split(codeRegex).map((part, index) => {
    if (index % 2 === 0) {
      return <Text key={index} dangerouslySetInnerHTML={{ __html: part }} />;
    }
    const [firstLine, ...remainingLines] = part.split('\n');
    return (
      <Box key={index}>
        <Text key={index} dangerouslySetInnerHTML={{ __html: firstLine }} fw={700} />
        <CodeHighlight code={remainingLines.join('\n')} language={firstLine || 'tsx'} />
      </Box>
    );
  });
};

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const [speakingPrompt, speakingPromptHandlers] = useDisclosure(false);
  const [speakingResponse, speakingResponseHandlers] = useDisclosure(false);
  const { response } = useSelector((state: RootState) => state.robot);
  const dispatch = useDispatch();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const form = useForm({
    initialValues: {
      prompt: '',
    },
    validate: {
      prompt: (value) => (value ? null : 'This field is required.'),
    },
  });

  const getPrompt = async () => {
    speechSynthesis.cancel();
    nprogress.start();
    const res = await apiCall(`/api/robot/prompts/${params.prompt}`);
    dispatch(setResponse(res?.data));
    nprogress.stop();
  };

  useEffect(() => {
    getPrompt();
  }, []);

  useEffect(() => {
    console.log('prompt genearated');

    return () => {
      speechSynthesis.cancel();
      nprogress.stop();
    };
  }, []);

  const sendMessage = async (prompt: string) => {
    if (prompt === '') {
      form.setFieldError('prompt', 'This field is required.');
      return;
    }
    nprogress.start();
    const res = await apiCall('/api/robot', { prompt }, 'POST', () => router.push('/'));
    router.push(`/robot/prompts/${res?.data._id}`);
    nprogress.complete();
  };

  const editPrompt = (prompt: string) => {
    if (textareaRef.current) {
      textareaRef?.current?.focus();
      textareaRef?.current.setSelectionRange(
        textareaRef?.current.value.length,
        textareaRef?.current.value.length
      );
    }
    form.setFieldValue('prompt', prompt);
  };

  const closeEditPrompt = () => textareaRef?.current?.blur();

  return (
    <Container px={0} size="md">
      <NewPrompt
        sendMessage={sendMessage}
        form={form}
        closeEditPrompt={closeEditPrompt}
        refEle={textareaRef}
      />
      {response && (
        <Paper key={String(response?._id)} p="xs" mt="xl" withBorder>
          <Stack gap="xs">
            <Text
              style={{ whiteSpace: 'pre-wrap' }}
              fw={700}
              dangerouslySetInnerHTML={{ __html: response?.prompt }}
            />
            <Group>
              <CopyButton value={response?.prompt}>
                {({ copied, copy }) => (
                  <ActionIcon
                    variant="transparent"
                    color="gray"
                    onClick={copy}
                    title="Copy to clipboard"
                  >
                    {copied ? <IconCheck size={18} /> : <IconClipboard size={18} />}
                  </ActionIcon>
                )}
              </CopyButton>
              <ActionIcon
                variant="transparent"
                color="gray"
                onClick={() =>
                  textToSpeech(
                    response?.prompt,
                    speakingPromptHandlers.open,
                    speakingPromptHandlers.close
                  )
                }
                title="Read Aloud"
              >
                {speakingPrompt ? <IconPlayerStopFilled size={18} /> : <IconVolume size={18} />}
              </ActionIcon>
              <ActionIcon
                variant="transparent"
                color="gray"
                onClick={() => editPrompt(response?.prompt)}
                title="Edit Prompt"
              >
                <IconPencil size={18} />
              </ActionIcon>
            </Group>
            <Divider variant="dashed" />
            <CodeRenderer text={renderBoldText(response.response).join('')} />
            <Group>
              <CopyButton value={response?.response}>
                {({ copied, copy }) => (
                  <ActionIcon
                    variant="transparent"
                    color="gray"
                    onClick={copy}
                    title="Copy to clipboard"
                  >
                    {copied ? <IconCheck size={18} /> : <IconClipboard size={18} />}
                  </ActionIcon>
                )}
              </CopyButton>
              <ActionIcon
                variant="transparent"
                color="gray"
                onClick={() =>
                  textToSpeech(
                    response?.response,
                    speakingResponseHandlers.open,
                    speakingResponseHandlers.close
                  )
                }
                title="Read Aloud"
              >
                {speakingResponse ? <IconPlayerStopFilled size={18} /> : <IconVolume size={18} />}
              </ActionIcon>
              <ActionIcon
                variant="transparent"
                color="gray"
                onClick={() => sendMessage(response?.prompt)}
                title="Regenerate"
              >
                <IconReload size={18} />
              </ActionIcon>
            </Group>
          </Stack>
        </Paper>
      )}
    </Container>
  );
};

export default Page;
