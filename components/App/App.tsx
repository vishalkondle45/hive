import { ActionIcon, Paper, Stack, Text } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { APPS } from '@/lib/constants';

interface Props {
  app: (typeof APPS)[number];
  isCurrent: boolean;
}

const App = ({ app, isCurrent }: Props) => {
  const router = useRouter();
  const { hovered, ref } = useHover();
  return (
    <Paper
      p="xs"
      ref={ref}
      bg={hovered || isCurrent ? `${app.color}.3` : 'transparent'}
      key={app.path}
      onClick={() => router.push(app.path)}
      style={{ cursor: 'pointer' }}
      c={hovered || isCurrent ? 'white' : 'dark'}
    >
      <Stack align="center" gap={4}>
        <ActionIcon variant="transparent" c={hovered || isCurrent ? 'white' : 'dark'} size="md">
          {app.icon}
        </ActionIcon>
        <Text>{app.label}</Text>
      </Stack>
    </Paper>
  );
};

export default App;
