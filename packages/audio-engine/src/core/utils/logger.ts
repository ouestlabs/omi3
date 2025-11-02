export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  category: string;
  message: string;
  data?: unknown;
}

class Logger {
  private enabled = false;
  private logs: LogEntry[] = [];
  private readonly maxLogs = 100;
  private readonly listeners: Set<(entry: LogEntry) => void> = new Set();

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  subscribe(listener: (entry: LogEntry) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clear(): void {
    this.logs = [];
  }

  private log(
    level: LogLevel,
    category: string,
    message: string,
    data?: unknown
  ): void {
    if (!this.enabled && level !== "error") {
      return;
    }

    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      category,
      message,
      data,
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    for (const listener of this.listeners) {
      listener(entry);
    }

    let logMethod: typeof console.debug;
    switch (level) {
      case "error":
        logMethod = console.error;
        break;
      case "warn":
        logMethod = console.warn;
        break;
      case "info":
        logMethod = console.info;
        break;
      default:
        logMethod = console.debug;
    }

    if (this.enabled || level === "error") {
      logMethod(`[AudioEngine:${category}]`, message, data ?? "");
    }
  }

  debug(category: string, message: string, data?: unknown): void {
    this.log("debug", category, message, data);
  }

  info(category: string, message: string, data?: unknown): void {
    this.log("info", category, message, data);
  }

  warn(category: string, message: string, data?: unknown): void {
    this.log("warn", category, message, data);
  }

  error(category: string, message: string, data?: unknown): void {
    this.log("error", category, message, data);
  }
}

export const logger = new Logger();
