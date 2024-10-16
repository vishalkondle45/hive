import { useState } from 'react';
import { Group, rem } from '@mantine/core';
import { useMove } from '@mantine/hooks';

const VolumeSlider = ({
  setVolume,
  volume,
}: {
  setVolume: (value: number) => void;
  volume: number;
}) => {
  const [value, setValue] = useState(volume);
  const { ref } = useMove(({ y }) => {
    setValue(1 - y);
    setVolume(1 - y);
  });

  return (
    <>
      <Group justify="center">
        <div
          ref={ref}
          style={{
            width: rem(16),
            height: rem(120),
            backgroundColor: 'var(--mantine-color-blue-light)',
            position: 'relative',
            touchAction: 'none',
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              height: `${value * 100}%`,
              width: rem(16),
              backgroundColor: 'var(--mantine-color-blue-filled)',
              opacity: 0.7,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: `calc(${value * 100}% - ${rem(0)})`,
              left: 0,
              width: rem(16),
              height: rem(16),
              backgroundColor: 'var(--mantine-color-blue-7)',
            }}
          />
        </div>
      </Group>
    </>
  );
};

export default VolumeSlider;
