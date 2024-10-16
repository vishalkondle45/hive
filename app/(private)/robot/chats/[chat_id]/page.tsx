'use client';

import { Blockquote, Box, Container, Skeleton, Stack, Text } from '@mantine/core';
import { useDisclosure, useScrollIntoView } from '@mantine/hooks';
import { useDispatch } from 'react-redux';
import { IconSparkles } from '@tabler/icons-react';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import Message from '@/components/Robot/Message';
import NewChat from '@/components/Robot/NewChat';
import { setChats } from '@/store/features/robotSlice';
import { getChat } from '@/services/Robot.service';
import { error } from '@/utils/functions';
import { useAppSelector } from '@/store/features/hooks';
import { setLoading } from '@/store/features/commonSlice';

const Page = () => {
  const params = useParams();
  const [opened, handlers] = useDisclosure(false);
  const dispatch = useDispatch();
  const { chats, loading } = useAppSelector((state) => state.robotSlice);
  const { scrollIntoView, targetRef, scrollableRef } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
  });

  const getChat1 = async () => {
    dispatch(setLoading(false));
    handlers.open();
    speechSynthesis.cancel();
    try {
      const res = await getChat(String(params.chat_id));
      dispatch(setChats(res.data.history));
    } catch (err) {
      error({ message: 'Failed to get chat.' });
    } finally {
      handlers.close();
    }
  };

  useEffect(() => {
    getChat1();
  }, []);

  useEffect(() => {
    scrollIntoView({ alignment: 'end' });
  }, [chats, opened]);

  useEffect(
    () => () => {
      speechSynthesis.cancel();
      handlers.close();
    },
    []
  );

  return (
    <>
      <Container px={0}>
        <Box h="80vh" style={{ overflowY: 'scroll' }} ref={scrollableRef}>
          <Stack pb="sm">
            {chats?.map(({ role, parts }, index) => (
              <Message
                ref={index === chats.length - 1 ? targetRef : undefined}
                key={index}
                isUser={role === 'user'}
                message={parts[0].text}
                isLast={index === chats.length - 1}
              />
            ))}
            {loading && (
              <>
                <Blockquote
                  radius={0}
                  iconSize={30}
                  color="teal"
                  icon={<IconSparkles />}
                  mt="xl"
                  ml="sm"
                  p="sm"
                  cite={<Text>- Robot</Text>}
                >
                  <Skeleton height={12} mt={6} radius="xl" />
                  <Skeleton height={12} mt={6} radius="xl" />
                  <Skeleton height={12} mt={6} width="70%" radius="xl" ref={targetRef} />
                </Blockquote>
              </>
            )}
          </Stack>
        </Box>
        <NewChat />
      </Container>
    </>
  );
};

export default Page;
