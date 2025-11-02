"use client";

import { useStore } from "@tanstack/react-store";
import React from "react";
import { queueStore } from "../../core/queue";
import { type LogEntry, logger } from "../../core/utils/logger";
import { audioStore } from "../store";

const MAX_LOGS = 49;

function getLogBackgroundColor(level: LogEntry["level"]): string {
  switch (level) {
    case "error":
      return "#7f1d1d";
    case "warn":
      return "#78350f";
    default:
      return "#1e293b";
  }
}

function getLogTextColor(level: LogEntry["level"]): string {
  switch (level) {
    case "error":
      return "#ef4444";
    case "warn":
      return "#f59e0b";
    default:
      return "#22c55e";
  }
}

/**
 * Component to visualize the state of the audio engine.
 *
 * @example
 * ```tsx
 * <AudioProvider>
 *   <AudioDevTools />
 *   <YourApp />
 * </AudioProvider>
 * ```
 */
export function AudioDevTools({ enabled = false }: { enabled?: boolean }) {
  const [logs, setLogs] = React.useState<LogEntry[]>([]);
  const [isOpen, setIsOpen] = React.useState(enabled);
  const [activeTab, setActiveTab] = React.useState<"state" | "queue" | "logs">(
    "state"
  );
  const audioState = useStore(audioStore);
  const queueState = useStore(queueStore);

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    const unsubscribe = logger.subscribe((entry) => {
      setLogs((prev) => [...prev.slice(-MAX_LOGS), entry]);
    });

    return unsubscribe;
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 9999,
          padding: "8px 16px",
          backgroundColor: "#000",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "12px",
        }}
        type="button"
      >
        Audio DevTools
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        width: "400px",
        maxHeight: "600px",
        backgroundColor: "#1a1a1a",
        color: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        fontFamily: "monospace",
        fontSize: "12px",
      }}
    >
      <div
        style={{
          padding: "12px",
          borderBottom: "1px solid #333",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "bold" }}>
          Audio Engine DevTools
        </h3>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => {
              logger.setEnabled(!logger.isEnabled());
            }}
            style={{
              padding: "4px 8px",
              backgroundColor: logger.isEnabled() ? "#22c55e" : "#444",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "10px",
            }}
            type="button"
          >
            {logger.isEnabled() ? "Log ON" : "Log OFF"}
          </button>
          <button
            onClick={() => {
              logger.clear();
              setLogs([]);
            }}
            style={{
              padding: "4px 8px",
              backgroundColor: "#444",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "10px",
            }}
            type="button"
          >
            Clear
          </button>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              padding: "4px 8px",
              backgroundColor: "#444",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "10px",
            }}
            type="button"
          >
            ×
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #333",
        }}
      >
        <button
          onClick={() => setActiveTab("state")}
          style={{
            flex: 1,
            padding: "8px",
            backgroundColor: activeTab === "state" ? "#333" : "transparent",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: "11px",
          }}
          type="button"
        >
          State
        </button>
        <button
          onClick={() => setActiveTab("queue")}
          style={{
            flex: 1,
            padding: "8px",
            backgroundColor: activeTab === "queue" ? "#333" : "transparent",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: "11px",
          }}
          type="button"
        >
          Queue
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          style={{
            flex: 1,
            padding: "8px",
            backgroundColor: activeTab === "logs" ? "#333" : "transparent",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: "11px",
          }}
          type="button"
        >
          Logs ({logs.length})
        </button>
      </div>

      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "12px",
        }}
      >
        {activeTab === "state" && (
          <pre
            style={{
              margin: 0,
              fontSize: "11px",
              lineHeight: "1.5",
              color: "#a1a1aa",
            }}
          >
            {JSON.stringify(
              {
                playbackState: audioState.playbackState,
                currentTime: audioState.currentTime.toFixed(2),
                duration: audioState.duration.toFixed(2),
                volume: audioState.volume,
                isMuted: audioState.isMuted,
                isBuffering: audioState.isBuffering,
                currentTrack: audioState.currentTrack?.url,
                error: audioState.error,
              },
              null,
              2
            )}
          </pre>
        )}

        {activeTab === "queue" && (
          <pre
            style={{
              margin: 0,
              fontSize: "11px",
              lineHeight: "1.5",
              color: "#a1a1aa",
            }}
          >
            {JSON.stringify(
              {
                items: queueState.items.length,
                currentIndex: queueState.currentIndex,
                repeatMode: queueState.repeatMode,
                shuffleMode: queueState.shuffleMode,
                history: queueState.history.length,
              },
              null,
              2
            )}
          </pre>
        )}

        {activeTab === "logs" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {logs.length === 0 ? (
              <div style={{ color: "#666", fontSize: "11px" }}>
                No logs yet. Enable logging to see events.
              </div>
            ) : (
              logs.map((log, index) => (
                <div
                  key={String(index)}
                  style={{
                    padding: "4px 8px",
                    backgroundColor: getLogBackgroundColor(log.level),
                    borderRadius: "4px",
                    fontSize: "10px",
                  }}
                >
                  <span style={{ color: "#999" }}>
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>{" "}
                  <span
                    style={{
                      color: getLogTextColor(log.level),
                      fontWeight: "bold",
                    }}
                  >
                    [{log.level.toUpperCase()}]
                  </span>{" "}
                  <span style={{ color: "#60a5fa" }}>[{log.category}]</span>{" "}
                  <span>{log.message}</span>
                  {log.data !== undefined && log.data !== null && (
                    <pre
                      style={{
                        margin: "4px 0 0 0",
                        fontSize: "9px",
                        color: "#a1a1aa",
                      }}
                    >
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
