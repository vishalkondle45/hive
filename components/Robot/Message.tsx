import { forwardRef } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { CodeHighlightTabs } from '@mantine/code-highlight';
import { ActionIcon, Blockquote, Box, CopyButton, Group, Text } from '@mantine/core';
import {
  IconCheck,
  IconClipboard,
  IconLetterV,
  IconPlayerStopFilled,
  IconSparkles,
  IconVolume,
} from '@tabler/icons-react';
import { markdownToHTML, renderBoldText, textToSpeech } from '@/utils/functions';
import { CODE_REGEX } from '@/utils/constants';
import ErrorBoundary from '../Utilities/ErrorBoundary';

const MessageRenderer = ({ text, isLast }: { text: string; isLast: boolean }) => {
  const blocks = text.split(CODE_REGEX);
  return blocks.map((part, index) => {
    if (index % 2 === 0) {
      return (
        <Text
          component="div"
          key={index}
          dangerouslySetInnerHTML={{ __html: markdownToHTML(part) }}
        />
      );
    }
    const [firstLine, ...remainingLines] = part.replaceAll('<br/>', '\n').split('\n');
    return (
      <ErrorBoundary
        fallback={
          <Text span key={index}>
            ``` {part} ```
          </Text>
        }
      >
        <CodeHighlightTabs
          w="100%"
          key={index}
          code={[
            {
              fileName: `demo.${firstLine}`,
              code: remainingLines.join('\n'),
              language: firstLine || 'tsx',
            },
          ]}
          mb={blocks.length - 1 === index ? 0 : 8}
          styles={{ codeWrapper: { width: '100%', overflow: 'auto' } }}
          withExpandButton
          defaultExpanded={isLast}
          expandCodeLabel="Show full code"
          collapseCodeLabel="Show less"
        />
      </ErrorBoundary>
    );
  });
};

const Message = (
  { isUser, message, isLast = false }: { isUser: boolean; message: string; isLast: boolean },
  ref: any
) => {
  const [speakingPrompt, speakingPromptHandlers] = useDisclosure(false);

  return (
    <Blockquote
      radius={0}
      iconSize={30}
      color={isUser ? 'red' : 'teal'}
      icon={isUser ? <IconLetterV /> : <IconSparkles />}
      mt="xl"
      ml="sm"
      p="sm"
      ref={ref}
      cite={
        <Group mt="md" justify="space-between">
          <Text>{`– ${isUser ? 'You' : 'Robot'}`}</Text>
          <Box>
            <CopyButton value={message}>
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
                textToSpeech(message, speakingPromptHandlers.open, speakingPromptHandlers.close)
              }
              title="Read Aloud"
            >
              {speakingPrompt ? <IconPlayerStopFilled size={18} /> : <IconVolume size={18} />}
            </ActionIcon>
          </Box>
        </Group>
      }
    >
      <MessageRenderer text={renderBoldText(message).join('')} isLast={isLast} />
    </Blockquote>
  );
};

export default forwardRef(Message);
