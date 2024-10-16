import { useRef } from 'react';

export const useScroll = () => {
  const viewport = useRef<HTMLDivElement>(null);
  const scrollToBottom = () =>
    viewport.current!.scrollTo({ top: viewport.current!.scrollHeight, behavior: 'smooth' });

  const scrollToCenter = () =>
    viewport.current!.scrollTo({ top: viewport.current!.scrollHeight / 2, behavior: 'smooth' });

  const scrollToTop = () => viewport.current!.scrollTo({ top: 0, behavior: 'smooth' });

  return { scrollToBottom, scrollToCenter, scrollToTop };
};
