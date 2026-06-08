import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import NotificationProvider from './components/NotificationProvider';
import RuntimeErrorProvider from './components/RuntimeErrorProvider';
import { GameProvider } from './context/GameContext';
import { ThemeProvider } from './context/ThemeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <NotificationProvider />
      <RuntimeErrorProvider>
        <ErrorBoundary>
          <GameProvider>
            <App />
          </GameProvider>
        </ErrorBoundary>
      </RuntimeErrorProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
