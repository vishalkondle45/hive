import { Button, rem } from '@mantine/core';
import { IconSparkles } from '@tabler/icons-react';

export const SparkButton = Button.withProps({
  leftSection: <IconSparkles style={{ width: rem(20), height: rem(20) }} />,
  size: 'compact-md',
  // children: 'Spark',
});
