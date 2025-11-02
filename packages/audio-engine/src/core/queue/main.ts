import { AsyncQueuer } from "@tanstack/pacer";
import type { IAudioEngine } from "../engine";
import type { BaseMetadata } from "../types";
import { logger } from "../utils/logger";
import { queueStore, queueStoreActions } from "./store";
import type { QueueItem, QueueState } from "./types";

/**
 * Options for Queue.
 */
export interface QueueOptions {
  /** Maximum size of the queue */
  maxSize?: number;
  /** Concurrency limit (default: 1 for audio) */
  concurrency?: number;
  /** Wait time between processing items in milliseconds */
  wait?: number;
  /** Reference to the audio engine */
  engine: IAudioEngine;
}

const DEFAULT_MAX_SIZE = 100;
const DEFAULT_CONCURRENCY = 1;
const DEFAULT_WAIT = 100;

/**
 * Queue manages the queue and the async processing of items.
 */
export class Queue<
  TData = unknown,
  TMetadata extends BaseMetadata = BaseMetadata,
> {
  private readonly engine: IAudioEngine;
  private readonly asyncQueuer: AsyncQueuer<QueueItem<TData, TMetadata>>;
  private readonly options: Required<QueueOptions>;

  constructor(options: QueueOptions) {
    this.engine = options.engine;
    this.options = {
      maxSize: options.maxSize ?? DEFAULT_MAX_SIZE,
      concurrency: options.concurrency ?? DEFAULT_CONCURRENCY,
      wait: options.wait ?? DEFAULT_WAIT,
      engine: options.engine,
    };

    this.asyncQueuer = new AsyncQueuer<QueueItem<TData, TMetadata>>(
      async (item) => {
        await this.processItem(item);
      },
      {
        maxSize: this.options.maxSize,
        concurrency: this.options.concurrency,
        wait: this.options.wait,
        started: false, // Don't auto-start, we'll control it manually
        onError: (error) => {
          logger.error("Queue", "Error processing item:", error);
        },
        onSuccess: () => {
          // Item processed successfully
        },
        onReject: () => {
          logger.warn(
            "Queue",
            `Item rejected - queue is full (max: ${this.options.maxSize})`
          );
        },
        onItemsChange: () => {
          // Synchronize items from AsyncQueuer to store
          this.syncItemsToStore();
        },
      }
    );

    // Initial sync
    this.syncItemsToStore();
  }

  /**
   * Synchronizes items from AsyncQueuer to the store.
   */
  private syncItemsToStore(): void {
    const items = this.getItems();
    queueStoreActions.setItems(items);
  }

  /**
   * Replaces all items in AsyncQueuer with new items.
   */
  private replaceItems(items: QueueItem<TData, TMetadata>[]): void {
    this.asyncQueuer.clear();
    for (const item of items) {
      this.asyncQueuer.addItem(item);
    }
  }

  /**
   * Gets all items from AsyncQueuer.
   */
  getItems(): QueueItem<TData, TMetadata>[] {
    return this.asyncQueuer.peekAllItems() as QueueItem<TData, TMetadata>[];
  }

  /**
   * Processes a queue item by loading and playing it.
   */
  private async processItem(item: QueueItem<TData, TMetadata>) {
    try {
      await this.engine.load(item);
      await this.engine.play();

      const items = this.getItems();
      const index = items.findIndex((i) => i.id === item.id);
      if (index !== -1) {
        queueStoreActions.setCurrentIndex(index);
        queueStoreActions.addToHistory(item);
      }
    } catch (error) {
      logger.error("Queue", "Error processing item:", error);
    }
  }

  /**
   * Gets the next index based on repeat and shuffle modes.
   */
  private getNextIndex(): number | null {
    const items = this.getItems();
    const state = queueStore.state;
    if (items.length === 0) {
      return null;
    }
    if (state.currentIndex === null) {
      return 0;
    }

    const current = state.currentIndex;
    const total = items.length;

    if (state.repeatMode === "one") {
      return current;
    }

    if (state.repeatMode === "all" && current === total - 1) {
      return state.shuffleMode ? this.getRandomIndex(total) : 0;
    }

    if (current < total - 1) {
      return state.shuffleMode ? this.getRandomIndex(total) : current + 1;
    }

    return state.repeatMode === "all" ? 0 : null;
  }

  /**
   * Gets a random index (for shuffle mode).
   */
  private getRandomIndex(max: number): number {
    return Math.floor(Math.random() * max);
  }

  /**
   * Adds an item to the queue.
   */
  addItem(item: QueueItem<TData, TMetadata>): void {
    this.asyncQueuer.addItem(item);
  }

  /**
   * Removes an item from the queue.
   */
  removeItem(id: string | number): void {
    const items = this.getItems();
    const removedIndex = items.findIndex((item) => item.id === id);

    if (removedIndex === -1) {
      return; // Item not found, nothing to do
    }

    // Remove from AsyncQueuer
    const filtered = items.filter((item) => item.id !== id);
    this.replaceItems(filtered);

    // Update currentIndex if needed
    const state = queueStore.state;
    if (state.currentIndex !== null) {
      if (removedIndex < state.currentIndex) {
        queueStoreActions.setCurrentIndex(state.currentIndex - 1);
      } else if (removedIndex === state.currentIndex) {
        const nextIndex = this.getNextIndex();
        queueStoreActions.setCurrentIndex(nextIndex);
      }
    }
  }

  /**
   * Processes the next item in the queue.
   */
  async processNext(): Promise<void> {
    await this.asyncQueuer.execute();
  }

  /**
   * Clears the queue.
   */
  clear(): void {
    queueStoreActions.clear();
    this.asyncQueuer.clear();
  }

  /**
   * Starts processing items automatically.
   */
  start(): void {
    this.asyncQueuer.start();
  }

  /**
   * Stops processing items automatically.
   */
  stop(): void {
    this.asyncQueuer.stop();
  }

  /**
   * Flushes all items in the queue, processing them immediately.
   */
  async flush(): Promise<void> {
    await this.asyncQueuer.flush();
  }

  /**
   * Shuffles the queue items.
   */
  shuffle(): void {
    const items = this.getItems();
    const shuffled = [...items];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const itemI = shuffled[i];
      const itemJ = shuffled[j];
      if (itemI && itemJ) {
        shuffled[i] = itemJ;
        shuffled[j] = itemI;
      }
    }

    // Update AsyncQueuer with shuffled items
    this.replaceItems(shuffled);
  }

  /**
   * Reorders items in the queue.
   */
  reorder(fromIndex: number, toIndex: number): void {
    const items = this.getItems();
    const reordered = [...items];
    const [removed] = reordered.splice(fromIndex, 1);
    if (removed) {
      reordered.splice(toIndex, 0, removed);
    }

    // Update AsyncQueuer with reordered items
    this.replaceItems(reordered);

    // Update currentIndex if needed
    const state = queueStore.state;
    if (state.currentIndex !== null) {
      let newIndex = state.currentIndex;
      if (fromIndex < state.currentIndex && toIndex >= state.currentIndex) {
        newIndex--;
      } else if (
        fromIndex > state.currentIndex &&
        toIndex <= state.currentIndex
      ) {
        newIndex++;
      } else if (fromIndex === state.currentIndex) {
        newIndex = toIndex;
      }
      queueStoreActions.setCurrentIndex(newIndex);
    }
  }

  /**
   * Gets the complete queue state (items from AsyncQueuer + metadata from store).
   */
  getState(): QueueState<TData, TMetadata> {
    return queueStore.state as QueueState<TData, TMetadata>;
  }

  /**
   * Subscribes to queue state changes.
   */
  subscribe(
    callback: (state: QueueState<TData, TMetadata>) => void
  ): () => void {
    return queueStore.subscribe(() => {
      callback(queueStore.state as QueueState<TData, TMetadata>);
    });
  }
}
