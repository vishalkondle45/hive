import { ActionIcon, Textarea } from '@mantine/core';
import { IconArrowUp, IconPrompt } from '@tabler/icons-react';
import { useQuery } from '@/hooks/useQuery';
import { setPrompt } from '@/store/features/robotSlice';
import { useAppDispatch, useAppSelector } from '@/store/features/hooks';

const NewChat = () => {
  const { prompt, loading } = useAppSelector((state) => state.robotSlice);
  const dispatch = useAppDispatch();
  const { sendPrompt } = useQuery();

  return (
    <form onSubmit={sendPrompt}>
      <Textarea
        rows={1}
        maxRows={8}
        placeholder="Message Robot"
        autosize
        leftSection={<IconPrompt />}
        rightSection={
          <ActionIcon
            radius="xl"
            variant="filled"
            disabled={!prompt.trim() || loading}
            size="md"
            type="submit"
          >
            <IconArrowUp />
          </ActionIcon>
        }
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            sendPrompt(event);
          }
        }}
        disabled={loading}
        data-autofocus
        value={loading ? '' : prompt}
        onChange={(event) => {
          dispatch(setPrompt(event.currentTarget.value));
        }}
        radius="xl"
        size="lg"
      />
    </form>
  );
};

export default NewChat;
