type LogLevel = "info" | "warn" | "error" | "debug";

interface ILogger {
  info(message: string, meta?: unknown): void;
  warn(message: string, meta?: unknown): void;
  error(message: string, meta?: unknown): void;
  debug(message: string, meta?: unknown): void;
}

const logLevels: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const minimumLogLevel: LogLevel = "info";

function serializeError(error: Error) {
  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
  };
}

function serializeLogValue(value: unknown): string {
  const seen = new WeakSet<object>();

  return JSON.stringify(value, (_key, entry: unknown) => {
    if (entry instanceof Error) {
      return serializeError(entry);
    }

    if (entry !== null && typeof entry === "object") {
      if (seen.has(entry)) {
        return "[Circular]";
      }

      seen.add(entry);
    }

    return entry;
  });
}

function writeLog(level: LogLevel, message: string, meta?: unknown) {
  if (logLevels[level] > logLevels[minimumLogLevel]) {
    return;
  }

  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(meta instanceof Error
      ? { error: meta }
      : meta !== undefined && typeof meta === "object" && meta !== null
        ? meta
        : meta !== undefined
          ? { meta }
          : {}),
  };

  console[level](serializeLogValue(entry));
}

export const logger: ILogger = {
  info: (message, meta) => writeLog("info", message, meta),
  warn: (message, meta) => writeLog("warn", message, meta),
  error: (message, meta) => writeLog("error", message, meta),
  debug: (message, meta) => writeLog("debug", message, meta),
};
