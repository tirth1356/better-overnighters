import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { MemberProvider } from './lib/member';
import { router } from '@/routes';
import './app.css';
import './styles/theme.css';

export default function App() {
  return (
    <AuthProvider>
      <MemberProvider>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              fontSize: '0.9rem',
              boxShadow: '0 8px 24px rgba(48,37,31,0.10)',
            },
          }}
        />
      </MemberProvider>
    </AuthProvider>
  );
}
