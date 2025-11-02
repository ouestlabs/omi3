import { Store } from "@tanstack/store";
import type { BaseMetadata } from "../types";
import type { QueueItem, QueueState } from "./types";

/**
 * Initial queue state.
 */
const initialQueueState: QueueState = {
  items: [],
  currentIndex: null,
  history: [],
  shuffleMode: false,
  repeatMode: "none",
};

/**
 * Core store for queue state management.
 */
const queueStore = new Store<QueueState>(initialQueueState);

/**
 * Get the current queue state.
 */
const getQueueState = (): QueueState => queueStore.state;

/**
 * Queue store actions for synchronous state updates.
 */
const queueStoreActions = {
  /**
   * Set the queue items.
   */
  setItems: <TData = unknown, TMetadata extends BaseMetadata = BaseMetadata>(
    items: QueueItem<TData, TMetadata>[]
  ): void => {
    queueStore.setState((prev) => ({
      ...prev,
      items: items as QueueItem[],
    }));
  },

  /**
   * Set the current index.
   */
  setCurrentIndex: (index: number | null): void => {
    queueStore.setState((prev) => ({
      ...prev,
      currentIndex: index,
    }));
  },

  /**
   * Set the shuffle mode.
   */
  setShuffleMode: (enabled: boolean): void => {
    queueStore.setState((prev) => ({
      ...prev,
      shuffleMode: enabled,
    }));
  },

  /**
   * Set the repeat mode.
   */
  setRepeatMode: (mode: "none" | "all" | "one"): void => {
    queueStore.setState((prev) => ({
      ...prev,
      repeatMode: mode,
    }));
  },

  /**
   * Add an item to history.
   */
  addToHistory: <
    TData = unknown,
    TMetadata extends BaseMetadata = BaseMetadata,
  >(
    item: QueueItem<TData, TMetadata>
  ): void => {
    queueStore.setState((prev) => ({
      ...prev,
      history: [...prev.history, item as QueueItem],
    }));
  },

  /**
   * Clear the queue.
   */
  clear: (): void => {
    queueStore.setState(() => initialQueueState);
  },
};

export { getQueueState, queueStore, queueStoreActions, initialQueueState };
