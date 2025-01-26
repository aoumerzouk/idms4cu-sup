import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import { PermissionProvider } from './contexts/PermissionContext';
import App from './App';
import './index.css';
import { initializeDatabase } from './services/db/initService';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

// Initialize database before rendering
initializeDatabase()
  .then(() => {
    createRoot(root).render(
      <StrictMode>
        <AuthProvider>
          <PermissionProvider>
            <App />
          </PermissionProvider>
        </AuthProvider>
      </StrictMode>
    );
  })
  .catch(error => {
    console.error('Failed to initialize database:', error);
    // Still render the app, but it might have limited functionality
    createRoot(root).render(
      <StrictMode>
        <AuthProvider>
          <PermissionProvider>
            <App />
          </PermissionProvider>
        </AuthProvider>
      </StrictMode>
    );
  });
