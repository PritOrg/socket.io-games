import { toast } from 'sonner';
import logger from './logger';

const seenErrors = new Set();

const getErrorMessage = (error) => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Unknown runtime error';
};

export const reportRuntimeError = (source, error) => {
  const message = getErrorMessage(error);
  const stack = error instanceof Error ? error.stack : null;
  const signature = `${message}:${stack || ''}`;

  if (seenErrors.has(signature)) {
    return;
  }

  seenErrors.add(signature);
  if (seenErrors.size > 25) {
    seenErrors.clear();
  }

  logger.error('APP', `${source}: ${message}`, stack ? { stack } : undefined);

  toast.error('Something went wrong', {
    description: `${source}: ${message}`,
  });
};
