import {
  ActionIcon,
  Container,
  Group,
  Image,
  Loader,
  Paper,
  Popover,
  rem,
  Slider,
  Stack,
  Text,
} from '@mantine/core';
import {
  IconMusic,
  IconPlayerPause,
  IconPlayerPlayFilled,
  IconPlayerSkipForwardFilled,
  IconRepeat,
  IconRepeatOnce,
  IconVolume,
} from '@tabler/icons-react';
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/features/hooks';
import { AWS_URL } from '@/utils/constants';
import VolumeSlider from './VolumeSlider';
import { setSelectedSong } from '@/store/features/musicSlice';

const PlayerBar = (_: any, ref: any) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const { selected, album, songs } = useAppSelector((state) => state.musicSlice);
  const repeatRef = useRef(false);
  const dispatch = useAppDispatch();

  const setEndValue = (value: number) => {
    ref.current.currentTime = (value / 100) * Number(selected?.duration);
    setSliderValue(value);
  };

  const setValue = (value: number) => {
    setSliderValue(value);
  };

  const setVolume = (value: number) => {
    ref.current.volume = value;
  };

  const toggle = (e: any) => {
    e.stopPropagation();
    if (isPlaying) {
      ref?.current?.pause();
    } else {
      ref?.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = useCallback(() => {
    if (repeatRef.current) {
      ref?.current?.load();
    } else {
      const index = songs.findIndex((s) => s._id === selected?._id);
      const isNextPresent = index !== -1 && index < songs.length - 1;
      if (isNextPresent) {
        dispatch(setSelectedSong(songs[index + 1]));
      } else {
        ref?.current?.pause();
      }
    }
  }, []);

  const toggleRepeat = () => {
    repeatRef.current = !repeatRef.current;
  };

  useEffect(() => {
    const player = ref?.current;
    if (player) {
      const handleCanPlay = () => {
        player?.play();
      };

      player?.load();
      player?.addEventListener('ended', playNext);
      player?.addEventListener('canplaythrough', handleCanPlay);
      player?.addEventListener('play', () => setIsPlaying(true));
      player?.addEventListener('pause', () => setIsPlaying(false));
      player?.addEventListener('loadstart', () => setLoading(true));
      player?.addEventListener('loadeddata', () => setLoading(false));
      player?.addEventListener('timeupdate', () => {
        const ct = Math.floor(player?.currentTime);
        setCurrentTime(ct);
        setSliderValue((ct / Number(selected?.duration)) * 100);
      });

      return () => {
        if (player) {
          player?.removeEventListener('ended', () => playNext);
          player?.removeEventListener('canplaythrough', handleCanPlay);
          player?.removeEventListener('play', () => setIsPlaying(true));
          player?.removeEventListener('pause', () => setIsPlaying(false));
          player?.removeEventListener('loadstart', () => setLoading(true));
          player?.removeEventListener('loadeddata', () => setLoading(false));
          player?.removeEventListener('timeupdate', () => {
            const ct = Math.floor(player?.currentTime);
            setCurrentTime(ct);
          });
        }
      };
    }
    return undefined;
  }, [selected.link]);

  if (!selected?.link) return <></>;

  return (
    <Paper c="dark">
      <audio
        style={{ display: 'none' }}
        src={AWS_URL + selected.link}
        ref={ref}
        preload="metadata"
        controls
      >
        <track kind="captions" />
      </audio>
      <Group gap="xs" wrap="nowrap" justify="space-between">
        <Group
          style={{ cursor: 'pointer' }}
          gap="xs"
          wrap="nowrap"
          onClick={() => _.setShowPlayer((old: boolean) => !old)}
        >
          <Image mah={42} src={album?.poster} />
          <Stack gap={0}>
            <Text lineClamp={1} fw={700} fz="sm">
              {selected?.title}
            </Text>
            <Text lineClamp={1} fz="xs">
              {selected?.artist?.join(', ')}
            </Text>
          </Stack>
        </Group>
        <Group gap={0} wrap="nowrap">
          <ActionIcon radius="xl" variant="transparent" onClick={toggle}>
            {loading ? (
              <Loader size="sm" />
            ) : isPlaying ? (
              <IconPlayerPause style={{ width: rem(30), height: rem(30) }} />
            ) : (
              <IconPlayerPlayFilled style={{ width: rem(30), height: rem(30) }} />
            )}
          </ActionIcon>
          <ActionIcon radius="xl" variant="transparent" onClick={playNext}>
            <IconPlayerSkipForwardFilled />
          </ActionIcon>
          <ActionIcon radius="xl" variant="transparent" onClick={toggleRepeat}>
            {repeatRef.current ? <IconRepeatOnce /> : <IconRepeat />}
          </ActionIcon>
          <Popover position="top" offset={0}>
            <Popover.Target>
              <ActionIcon radius="xl" variant="transparent">
                <IconVolume />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown style={{ backgroundColor: 'transparent' }} p={0}>
              <VolumeSlider setVolume={setVolume} volume={ref.current?.volume} />
            </Popover.Dropdown>
          </Popover>
        </Group>
      </Group>
      <Container mt={6} size="100%" p={0}>
        <Slider
          color="blue"
          defaultValue={(currentTime / Number(selected?.duration)) * 100}
          value={sliderValue}
          onChangeEnd={setEndValue}
          onChange={setValue}
          showLabelOnHover={false}
          thumbChildren={<IconMusic size="1rem" />}
          thumbSize={10}
          size="xs"
          styles={{ thumb: { borderWidth: rem(2), padding: rem(3) } }}
          label={(value) =>
            `${Math.floor(Number((value / 100) * Number(selected?.duration)) / 60)
              .toFixed(0)
              .padStart(
                2,
                '0'
              )}:${(Number((value / 100) * Number(selected?.duration)) % 60).toFixed(0).padStart(2, '0')}`
          }
        />
        <Group justify="space-between">
          <Text size="xs">
            {Math.floor(currentTime / 60)
              .toFixed(0)
              .padStart(2, '0')}
            :
            {Math.ceil(currentTime % 60)
              .toFixed(0)
              .padStart(2, '0')}
          </Text>
          <Text size="xs">
            {Math.floor(Number(selected?.duration) / 60)
              .toFixed(0)
              .padStart(2, '0')}
            :
            {Math.floor(Number(selected?.duration) % 60)
              .toFixed(0)
              .padStart(2, '0')}
          </Text>
        </Group>
      </Container>
    </Paper>
  );
};

export default forwardRef(PlayerBar);
