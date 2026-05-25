const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel = LOG_LEVELS.info;

const formatTime = () => {
  return new Date().toLocaleTimeString();
};

const colors = {
  reset: '\x1b[0m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  gray: '\x1b[90m',
};

const logger = {
  debug: (category, message, data) => {
    if (currentLevel <= LOG_LEVELS.debug) {
      console.log(
        `${colors.blue}[${formatTime()}]${colors.reset} ${colors.gray}[${category}]${colors.reset} ${message}`,
        data || '',
      );
    }
  },

  info: (category, message, data) => {
    if (currentLevel <= LOG_LEVELS.info) {
      console.log(
        `${colors.blue}[${formatTime()}]${colors.reset} ${colors.cyan}[${category}]${colors.reset} ${message}`,
        data || '',
      );
    }
  },

  warn: (category, message, data) => {
    if (currentLevel <= LOG_LEVELS.warn) {
      console.warn(
        `${colors.blue}[${formatTime()}]${colors.reset} ${colors.yellow}[${category}]${colors.reset} ${message}`,
        data || '',
      );
    }
  },

  error: (category, message, data) => {
    if (currentLevel <= LOG_LEVELS.error) {
      console.error(
        `${colors.blue}[${formatTime()}]${colors.reset} ${colors.red}[${category}]${colors.reset} ${message}`,
        data || '',
      );
    }
  },

  socket: (direction, event, data) => {
    const dirColor = direction === '⬅️' ? colors.yellow : colors.green;
    const eventColor = direction === '⬅️' ? colors.cyan : colors.magenta;
    console.log(
      `${colors.blue}[${formatTime()}]${colors.reset} ${dirColor}[${direction}]${colors.reset} ` +
        `${eventColor}[${event}]${colors.reset}`,
      data || '',
    );
  },
};

export default logger;
