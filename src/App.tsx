import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { useEffect, cloneElement } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { useGlobalState } from './states/globalState';

const queryClient = new QueryClient();

const App = () => {
  const { pathname } = useLocation();
  const element = useOutlet();
  const { theme, setTheme } = useGlobalState();

  useEffect(() => {
    setTheme(theme || 'dark-blue');
  }, [theme, setTheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <AnimatePresence mode="wait">
        {element && cloneElement(element, { key: pathname })}
      </AnimatePresence>
    </QueryClientProvider>
  );
};

export default App;
