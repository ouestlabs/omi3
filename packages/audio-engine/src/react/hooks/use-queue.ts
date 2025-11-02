"use client";

import { useStore } from "@tanstack/react-store";
import { useContext, useMemo } from "react";
import { type QueueItem, type QueueState, queueStore } from "../../core/queue";
import type { BaseMetadata } from "../../core/types";
import { QueueContext } from "../context";

/**
 * Hook for managing the queue.
 */
export function useQueue<
  TData = unknown,
  TMetadata extends BaseMetadata = BaseMetadata,
>() {
  const queue = useContext(QueueContext);
  if (!queue) {
    throw new Error("useQueue must be used within an AudioProvider");
  }
  const queueState = useStore(
    queueStore,
    (state) => state as QueueState<TData, TMetadata>
  );

  return useMemo(
    () => ({
      items: queueState.items as QueueItem<TData, TMetadata>[],
      currentIndex: queueState.currentIndex,
      currentItem:
        queueState.currentIndex !== null &&
        queueState.currentIndex >= 0 &&
        queueState.currentIndex < queueState.items.length
          ? (queueState.items[queueState.currentIndex] as QueueItem<
              TData,
              TMetadata
            >)
          : null,
      history: queueState.history as QueueItem<TData, TMetadata>[],
      repeatMode: queueState.repeatMode,
      shuffleMode: queueState.shuffleMode,

      addItem: (item: QueueItem<TData, TMetadata>) => {
        queue.addItem(item);
      },
      removeItem: (id: string | number) => {
        queue.removeItem(id);
      },
      clear: () => {
        queue.clear();
      },
      shuffle: () => {
        queue.shuffle();
      },
      reorder: (fromIndex: number, toIndex: number) => {
        queue.reorder(fromIndex, toIndex);
      },
      setRepeatMode: (mode: QueueState["repeatMode"]) => {
        queueStore.setState((prev) => ({ ...prev, repeatMode: mode }));
      },
      setShuffleMode: (enabled: boolean) => {
        queueStore.setState((prev) => ({ ...prev, shuffleMode: enabled }));
      },
    }),
    [queueState, queue]
  );
}
