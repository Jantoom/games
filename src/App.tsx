import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

const queryClient = new QueryClient();

const App = () => {
  const { pathname } = useLocation();
  const element = useOutlet();

  return (
    <QueryClientProvider client={queryClient}>
      <AnimatePresence mode="wait">
        {element && React.cloneElement(element, { key: pathname })}
      </AnimatePresence>
    </QueryClientProvider>
  );
};

export default App;
