"use client";

import { Store } from "@tanstack/react-store";
import type { AudioEngineState } from "../provider/state";
import { initialState } from "../provider/state";

/**
 * Global audio store
 */
export const audioStore = new Store<AudioEngineState>(initialState);

/**
 * Get the current state of the audio store.
 */
export const getAudioState = (): AudioEngineState => audioStore.state;

/**
 * Reset the audio store to initial state.
 */
export const resetAudioStore = (): void => {
  audioStore.setState(() => initialState);
};
