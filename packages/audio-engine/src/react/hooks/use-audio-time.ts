"use client";

import { useStore } from "@tanstack/react-store";
import { audioStore } from "../store";

/**
 * Hook for retrieving only currentTime and duration.
 */
export function useAudioTime() {
  return useStore(audioStore, (state) => ({
    currentTime: state.currentTime,
    duration: state.duration,
  }));
}
