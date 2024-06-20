import { ActionIcon, Paper, Stack, Text } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { APPS } from '@/lib/constants';

const App = ({ app }: { app: (typeof APPS)[number] }) => {
  const router = useRouter();
  const { hovered, ref } = useHover();
  return (
    <Paper
      p="xs"
      ref={ref}
      bg={hovered ? app.color : 'transparent'}
      key={app.path}
      onClick={() => router.push(app.path)}
      style={{ cursor: 'pointer' }}
      c={hovered ? 'white' : 'dark'}
    >
      <Stack align="center" gap={4}>
        <ActionIcon variant="transparent" c={hovered ? 'white' : 'dark'} size="md">
          {app.icon}
        </ActionIcon>
        <Text>{app.label}</Text>
      </Stack>
    </Paper>
  );
};

export default App;
