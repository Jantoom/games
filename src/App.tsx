import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { cloneElement } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';

const queryClient = new QueryClient();

const App = () => {
  const { pathname } = useLocation();
  const element = useOutlet();

  return (
    <QueryClientProvider client={queryClient}>
      <AnimatePresence mode="wait">
        {element && cloneElement(element, { key: pathname })}
      </AnimatePresence>
    </QueryClientProvider>
  );
};

export default App;
