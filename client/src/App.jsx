import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <NotificationProvider>
            <ErrorBoundary>
            <div
              style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                overflowX: 'hidden',
              }}
            >
              <Navbar />
              <main
                style={{ flex: 1 }}
                id="main-content"
                role="main"
              >
                <AppRoutes />
              </main>
              <Footer />
            </div>
          </ErrorBoundary>
        </NotificationProvider>
      </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
