import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './main.css';
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFound from './pages/NotFound.tsx';
import Page from './pages/page.type.ts';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      errorElement: <NotFound />,
      children: Object.values(Page),
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  },
);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider
      future={{
        v7_startTransition: true,
      }}
      router={router}
    />
  </React.StrictMode>,
);
