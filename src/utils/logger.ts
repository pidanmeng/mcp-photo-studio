import type { SerializableValue } from 'fastmcp';
type Log = {
  debug: (message: string, data?: SerializableValue) => void;
  error: (message: string, data?: SerializableValue) => void;
  info: (message: string, data?: SerializableValue) => void;
  warn: (message: string, data?: SerializableValue) => void;
};

let logger: Log;

export function useLogger(log?: Log) {
  if (log) {
    logger = log;
  }
  if (!logger) {
    throw new Error('Logger not initialized');
  }
  return logger;
}
