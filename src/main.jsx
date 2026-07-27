import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import './index.css';
import App from './App.jsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#111827',
            color: '#00ff9d',
            border: '1px solid rgba(0,255,157,0.3)',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '12px',
          },
          success: { iconTheme: { primary: '#00ff9d', secondary: '#0a0e0f' } },
          error: {
            style: { color: '#ff3860', border: '1px solid rgba(255,56,96,0.4)' },
            iconTheme: { primary: '#ff3860', secondary: '#0a0e0f' },
          },
        }}
      />
    </QueryClientProvider>
  </StrictMode>
);
