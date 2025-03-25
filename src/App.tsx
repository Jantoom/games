import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect } from 'react';
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
        {element && React.cloneElement(element, { key: pathname })}
      </AnimatePresence>
    </QueryClientProvider>
  );
};

export default App;
