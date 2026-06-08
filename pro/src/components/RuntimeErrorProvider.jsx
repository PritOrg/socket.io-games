import { useEffect } from 'react';
import { reportRuntimeError } from '../utils/runtimeError';

export default function RuntimeErrorProvider({ children }) {
  useEffect(() => {
    const handleWindowError = (event) => {
      reportRuntimeError('Window error', event.error || event.message || 'Unknown browser error');
    };

    const handleUnhandledRejection = (event) => {
      reportRuntimeError('Unhandled promise rejection', event.reason || 'Unknown promise rejection');
    };

    window.addEventListener('error', handleWindowError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleWindowError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return children;
}
