'use client';

import { Avatar, Box, Button, Group, Paper, rem, Stack, Text } from '@mantine/core';
import { useFetch } from '@mantine/hooks';
import { Carousel } from '@mantine/carousel';
import { SparkButton } from '@/components/Custom';
import { UserDocument } from '@/models/User';
import classes from './Slideshow.module.css';
import useFetchData from '@/hooks/useFetchData';
import { apiCall } from '@/lib/client_functions';

export const Suggested = () => {
  const { data: suggested } = useFetchData('/api/sparks/suggested');
  const { data: sparks, refetch: refetchSparks } = useFetch('/api/sparks');

  const onSpark = async (_id: string) => {
    await apiCall('/api/sparks', { to: _id }, 'POST');
    refetchSparks();
  };
  return (
    <Box>
      <Group my={rem(8)} justify="space-between">
        <Text c="dimmed" fw={700}>
          Suggested
        </Text>
        <Button size="compact-md" variant="transparent">
          See All
        </Button>
      </Group>
      {Array.isArray(sparks) && (
        <Carousel
          classNames={classes}
          slideSize={{ base: '60%', xs: '40%', md: '26%', lg: '22%', xl: '18%' }}
          slideGap={{ base: 'md' }}
          align="start"
          controlsOffset={0}
          withControls={false}
          loop
        >
          {suggested?.map((item: UserDocument) => (
            <Carousel.Slide key={String(item?._id)}>
              <Paper p="md" withBorder>
                <Stack gap={rem(6)} align="center">
                  <Avatar size="xl" color="initials" src={item?.image} name={item?.name} />
                  <Text fw={700} size="sm">
                    {item?.username ?? 'Anonymous'}
                  </Text>
                  <Text>{item?.name}</Text>
                  <SparkButton
                    variant={sparks?.find((i: any) => i.to === item?._id) ? 'outline' : 'filled'}
                    onClick={() => onSpark(String(item?._id))}
                  >
                    {sparks?.find((i: any) => i.to === item?._id) ? 'Unspark' : 'Spark'}
                  </SparkButton>
                </Stack>
              </Paper>
            </Carousel.Slide>
          ))}
        </Carousel>
      )}
    </Box>
  );
};
