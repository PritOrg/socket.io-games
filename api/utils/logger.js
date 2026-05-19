const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

const formatTime = () => {
  return new Date().toISOString();
};

const logger = {
  info: (category, message, ...args) => {
    console.log(`${colors.blue}[${formatTime()}]${colors.reset} ${colors.cyan}[${category}]${colors.reset} ${message}`, ...args);
  },

  success: (category, message, ...args) => {
    console.log(`${colors.blue}[${formatTime()}]${colors.reset} ${colors.green}[${category}]${colors.reset} ${message}`, ...args);
  },

  warn: (category, message, ...args) => {
    console.warn(`${colors.blue}[${formatTime()}]${colors.reset} ${colors.yellow}[${category}]${colors.reset} ${message}`, ...args);
  },

  error: (category, message, ...args) => {
    console.error(`${colors.blue}[${formatTime()}]${colors.reset} ${colors.red}[${category}]${colors.reset} ${message}`, ...args);
  },

  debug: (category, message, ...args) => {
    if (process.env.DEBUG) {
      console.log(`${colors.blue}[${formatTime()}]${colors.reset} ${colors.gray}[${category}]${colors.reset} ${message}`, ...args);
    }
  },

  socket: (direction, event, socketId, data) => {
    const dirColor = direction === 'IN' ? colors.yellow : colors.magenta;
    const eventColor = direction === 'IN' ? colors.cyan : colors.green;
    console.log(
      `${colors.blue}[${formatTime()}]${colors.reset} ${dirColor}[${direction}]${colors.reset} ` +
      `${eventColor}[${event}]${colors.reset} ${colors.gray}socket:${socketId}${colors.reset}`,
      data ? '-' : '',
      data || ''
    );
  },
};

module.exports = logger;