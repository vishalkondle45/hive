import { useMediaQuery } from '@mantine/hooks';

export const useResponsiveness = () => {
  const isMobile = useMediaQuery('(max-width: 36em)');
  const isTablet = useMediaQuery('(min-width: 36.063em) and (max-width: 48em)');
  const isDesktop = useMediaQuery('(min-width: 48.063em)');
  return { isMobile, isTablet, isDesktop };
};
