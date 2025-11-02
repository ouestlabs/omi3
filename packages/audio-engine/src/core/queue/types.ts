import type { BaseMetadata, Track } from "../types";

/**
 * Base interface for queue items.
 */
export interface QueueItem<
  TData = unknown,
  TMetadata extends BaseMetadata = BaseMetadata,
> extends Track<TMetadata> {
  /** Required unique identifier for the queue item */
  id: string | number;
  /** Optional custom data associated with this item */
  data?: TData;
}

/**
 * State for the queue module.
 */
export interface QueueState<
  TData = unknown,
  TMetadata extends BaseMetadata = BaseMetadata,
> {
  /** Array of items in the queue */
  items: QueueItem<TData, TMetadata>[];
  /** Index of the currently active item, or null if none */
  currentIndex: number | null;
  /** History of played items */
  history: QueueItem<TData, TMetadata>[];
  /** Whether shuffle mode is enabled */
  shuffleMode: boolean;
  /** Repeat mode: 'none', 'all', or 'one' */
  repeatMode: "none" | "all" | "one";
}
