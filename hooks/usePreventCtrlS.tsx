import { useEffect } from 'react';

const usePreventCtrlS = () => {
  const handleKeyDown = (event: { metaKey: boolean; key: string; preventDefault: () => void }) => {
    if (event.metaKey && event.key === 's') {
      event.preventDefault();
      // Ctrl + S pressed
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
};

export default usePreventCtrlS;
