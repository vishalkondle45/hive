import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/features/hooks';
import { setChats, setPrompt, setLoading } from '@/store/features/robotSlice';
import { postChat, putChat } from '@/services/Robot.service';
import { error } from '@/utils/functions';

export const useQuery = () => {
  const { prompt, chats } = useAppSelector((state) => state.robotSlice);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();

  const sendPrompt = async (e: any, text?: string) => {
    e?.preventDefault();
    if (!text?.trim() && !prompt.trim()) {
      error({ message: 'Prompt is required.' });
      return;
    }
    if (!params.chat_id) {
      dispatch(setLoading(true));
    }
    const promptMessage = { role: 'user', parts: [{ text: text || prompt }] };
    dispatch(setChats([...chats, promptMessage]));
    dispatch(setLoading(true));
    try {
      let res: any;
      if (params.chat_id) {
        res = await putChat(String(params.chat_id), { prompt });
      } else {
        res = await postChat({ prompt: text || prompt });
      }
      if (!params.chat_id) {
        router.push(`/robot/chats/${res.data._id}`);
      } else {
        dispatch(setChats([...chats, promptMessage, res.data]));
      }
      dispatch(setPrompt(''));
    } catch (err) {
      console.log(err);
      error({ message: 'Failed to send prompt.' });
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { sendPrompt };
};
