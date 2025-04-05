import './main.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import NotFound from './pages/NotFound';
import Page from './pages/page.type';

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

createRoot(document.querySelector('#root')).render(
  <React.StrictMode>
    <RouterProvider
      future={{
        v7_startTransition: true,
      }}
      router={router}
    />
  </React.StrictMode>,
);
