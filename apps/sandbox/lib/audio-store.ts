import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { $audio, isLive, type Track } from "@/lib/audio";

type RepeatMode = "none" | "one" | "all";
type InsertMode = "first" | "last" | "after";

type AudioStore = {
  // State
  currentTrack: Track | null;
  queue: Track[];
  history: Track[];
  isPlaying: boolean;
  isLoading: boolean;
  isBuffering: boolean;
  volume: number;
  isMuted: boolean;
  repeatMode: RepeatMode;
  shuffleEnabled: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  bufferedTime: number;
  insertMode: InsertMode;
  isError: boolean;
  errorMessage: string | null;
  currentQueueIndex: number;

  // Playback Actions
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setQueueAndPlay: (tracks: Track[], startIndex: number) => Promise<void>;
  handleTrackEnd: () => void;

  // Queue Actions
  addToQueue: (track: Track, mode?: InsertMode) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  moveInQueue: (fromIndex: number, toIndex: number) => void;
  setQueue: (tracks: Track[], startIndex?: number) => void;
  getCurrentQueueIndex: () => number;
  addTracksToEndOfQueue: (tracksToAdd: Track[]) => void;

  // Control Actions
  setVolume: (params: { volume: number }) => void;
  toggleMute: () => void;
  changeRepeatMode: () => void;
  setInsertMode: (mode: InsertMode) => void;
  shuffle: () => void;
  unshuffle: () => void;
  setRepeatMode: (mode: RepeatMode) => void;

  // State Actions
  setCurrentTrack: (track: Track | null) => Promise<void>;
  setError: (message: string | null) => void;
};

function canUseDOM() {
  return !!(
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
  );
}

type QueueNavigationParams = {
  queue: Track[];
  currentQueueIndex: number;
  shuffleEnabled: boolean;
  repeatMode: RepeatMode;
};

type GetRandomShuffleIndexParams = {
  queueLength: number;
  currentIndex: number;
};

/**
 * Calculates a random index for shuffle mode
 */
const getRandomShuffleIndex = (params: GetRandomShuffleIndexParams): number => {
  const { queueLength, currentIndex } = params;
  if (queueLength === 1) {
    return 0;
  }
  let randomIndex: number;
  do {
    randomIndex = Math.floor(Math.random() * queueLength);
  } while (randomIndex === currentIndex);
  return randomIndex;
};

type CalculateQueueIndexParams = QueueNavigationParams & {
  direction: 1 | -1;
};

/**
 * Calculates the next or previous index in the queue based on direction
 */
const calculateQueueIndex = (params: CalculateQueueIndexParams): number => {
  const { queue, currentQueueIndex, shuffleEnabled, repeatMode, direction } =
    params;

  if (queue.length === 0) {
    return -1;
  }

  if (shuffleEnabled) {
    const singleTrackIndex = repeatMode === "none" ? -1 : 0;
    return queue.length === 1
      ? singleTrackIndex
      : getRandomShuffleIndex({
          queueLength: queue.length,
          currentIndex: currentQueueIndex,
        });
  }

  const newIndex = currentQueueIndex + direction;
  const isAtEnd = newIndex >= queue.length;
  const isAtStart = newIndex < 0;

  if (isAtEnd) {
    return repeatMode === "all" ? 0 : -1;
  }

  if (isAtStart) {
    return repeatMode === "all" ? queue.length - 1 : -1;
  }

  return newIndex;
};

/**
 * Calculates the index of the next track
 */
const calculateNextIndex = (params: QueueNavigationParams): number =>
  calculateQueueIndex({
    ...params,
    direction: 1,
  });

/**
 * Calculates the index of the previous track
 */
const calculatePreviousIndex = (params: QueueNavigationParams): number =>
  calculateQueueIndex({
    ...params,
    direction: -1,
  });

/**
 * Default state after successful track loading
 */
const getSuccessState = (params: { isPlaying?: boolean } = {}) => ({
  isLoading: false,
  isError: false,
  errorMessage: null,
  isBuffering: false,
  isPlaying: params.isPlaying ?? false,
});

/**
 * Default state after loading error
 */
const getErrorState = (params: { errorMessage: string }) => ({
  isLoading: false,
  isPlaying: false,
  isError: true,
  errorMessage: params.errorMessage,
  isBuffering: false,
});

type LoadAndPlayTrackParams = {
  track: Track;
  queueIndex: number;
  set: (partial: Partial<AudioStore>) => void;
  errorMessage: string;
};

/**
 * Loads and plays a track with error handling
 */
const loadAndPlayTrack = async (
  params: LoadAndPlayTrackParams
): Promise<void> => {
  const { track, queueIndex, set, errorMessage } = params;
  const isLiveStream = isLive(track);

  set({
    currentTrack: track,
    currentQueueIndex: queueIndex,
    isLoading: true,
    isBuffering: true,
  });

  try {
    await $audio.load({
      url: track.url,
      startTime: 0,
      isLiveStream,
    });
    await $audio.play();
    set(getSuccessState({ isPlaying: true }));
  } catch (error) {
    console.error(errorMessage, error);
    set(getErrorState({ errorMessage }));
    throw error;
  }
};

const useAudioStore = create<AudioStore>()(
  persist(
    subscribeWithSelector((set, get) => ({
      // Initial State
      currentTrack: null,
      queue: [],
      history: [],
      isPlaying: false,
      isLoading: false,
      isBuffering: false,
      volume: 1,
      isMuted: false,
      repeatMode: "none",
      shuffleEnabled: false,
      currentTime: 0,
      duration: 0,
      progress: 0,
      bufferedTime: 0,
      insertMode: "last",
      isError: false,
      errorMessage: null,
      currentQueueIndex: -1,

      // Playback Actions
      async play() {
        if (get().isLoading) {
          return;
        }
        await $audio.play();
      },

      pause() {
        $audio.pause();
      },

      togglePlay() {
        if (get().isLoading) {
          return;
        }
        if ($audio.isPaused()) {
          get().play();
        } else {
          get().pause();
        }
      },

      async next() {
        const state = get();
        const nextIndex = calculateNextIndex({
          queue: state.queue,
          currentQueueIndex: state.currentQueueIndex,
          shuffleEnabled: state.shuffleEnabled,
          repeatMode: state.repeatMode,
        });

        const nextTrack = state.queue[nextIndex];
        if (nextIndex === -1 || !nextTrack) {
          $audio.pause();
          set({ isLoading: false, isPlaying: false, isBuffering: false });
          return;
        }

        await loadAndPlayTrack({
          track: nextTrack,
          queueIndex: nextIndex,
          set,
          errorMessage: "Error loading/playing next track",
        });
      },

      async previous() {
        const state = get();
        const currentTime = $audio.getCurrentTime();
        const RESTART_THRESHOLD = 3;

        // If track has more than 3 seconds and shuffle is not enabled, restart the track
        if (currentTime > RESTART_THRESHOLD && !state.shuffleEnabled) {
          set({ isLoading: true });
          try {
            $audio.setCurrentTime(0);
            set({ currentTime: 0, progress: 0, isLoading: false });
            return;
          } catch (error) {
            console.error("Error restarting current track:", error);
            set({ isLoading: false });
            return;
          }
        }

        const prevIndex = calculatePreviousIndex({
          queue: state.queue,
          currentQueueIndex: state.currentQueueIndex,
          shuffleEnabled: state.shuffleEnabled,
          repeatMode: state.repeatMode,
        });

        const prevTrack = state.queue[prevIndex];
        if (prevIndex === -1 || !prevTrack) {
          if (prevIndex !== -1) {
            console.error(
              "Inconsistency: previous index is valid but track not found"
            );
          }
          $audio.pause();
          set({ isLoading: false, isPlaying: false, isBuffering: false });
          return;
        }

        await loadAndPlayTrack({
          track: prevTrack,
          queueIndex: prevIndex,
          set,
          errorMessage: "Error loading/playing previous track",
        });
      },

      seek(time: number) {
        $audio.setCurrentTime(time);
        set({ currentTime: time });
      },

      async setQueueAndPlay(songs: Track[], startIndex: number) {
        const targetTrack = songs[startIndex];
        if (!targetTrack) {
          console.error("[Playback] Invalid startIndex for setQueueAndPlay");
          get().clearQueue();
          $audio.pause();
          set({
            isPlaying: false,
            isLoading: false,
            currentTrack: null,
            currentQueueIndex: -1,
          });
          return;
        }

        get().setQueue(songs, startIndex);

        const errorMessage = `Error playing ${targetTrack.title || "track"}`;
        await loadAndPlayTrack({
          track: targetTrack,
          queueIndex: startIndex,
          set,
          errorMessage,
        });
      },

      handleTrackEnd() {
        get().next();
      },

      // Queue Actions
      setQueue(tracks: Track[], startIndex = 0) {
        const currentTrack = tracks[startIndex] ?? null;
        set({
          queue: tracks,
          currentQueueIndex: currentTrack ? startIndex : -1,
          currentTrack,
        });
      },

      getCurrentQueueIndex() {
        return get().currentQueueIndex;
      },

      addToQueue(track: Track, mode = "last") {
        const state = get();
        if (!state.currentTrack) {
          set({
            currentTrack: track,
            currentQueueIndex: 0,
            queue: [track],
          });
          return;
        }

        switch (mode) {
          case "first":
            set({
              queue: [track, ...state.queue],
              currentQueueIndex: state.currentQueueIndex + 1,
            });
            break;
          case "after":
            set({
              queue: [
                ...state.queue.slice(0, state.currentQueueIndex + 1),
                track,
                ...state.queue.slice(state.currentQueueIndex + 1),
              ],
            });
            break;
          default:
            set({ queue: [...state.queue, track] });
        }
      },

      removeFromQueue(trackId) {
        const state = get();
        const index = state.queue.findIndex((s) => s.id === trackId);
        if (index === -1) {
          return;
        }

        const newQueue = state.queue.filter((s) => s.id !== trackId);
        set({
          queue: newQueue,
          currentQueueIndex:
            index < state.currentQueueIndex
              ? state.currentQueueIndex - 1
              : state.currentQueueIndex,
        });
      },

      clearQueue() {
        set({ queue: [] });
      },

      moveInQueue(fromIndex, toIndex) {
        const newQueue = [...get().queue];
        const [movedItem] = newQueue.splice(fromIndex, 1);
        if (!movedItem) {
          return;
        }

        newQueue.splice(toIndex, 0, movedItem);
        set({ queue: newQueue });
      },

      addTracksToEndOfQueue(tracksToAdd: Track[]) {
        if (!tracksToAdd || tracksToAdd.length === 0) {
          return;
        }

        const state = get();
        const currentQueueIds = new Set(state.queue.map((s) => s.id));
        const newTracks = tracksToAdd.filter(
          (track) => !currentQueueIds.has(track.id)
        );

        if (newTracks.length > 0) {
          set({ queue: [...state.queue, ...newTracks] });
        }
      },

      // Control Actions
      setVolume(params: { volume: number }) {
        const { volume } = params;
        $audio.setVolume({ volume });
        set({ volume, isMuted: volume === 0 });
      },

      toggleMute() {
        const newMuted = !get().isMuted;
        $audio.setMuted(newMuted);
        set({ isMuted: newMuted });
      },

      changeRepeatMode() {
        const modes: RepeatMode[] = ["none", "one", "all"];
        const currentIndex = modes.indexOf(get().repeatMode);
        const newMode = modes[(currentIndex + 1) % modes.length];
        set({ repeatMode: newMode });
      },

      setRepeatMode(mode) {
        set({ repeatMode: mode });
      },

      setInsertMode(mode) {
        set({ insertMode: mode });
      },

      shuffle() {
        const state = get();
        if (
          !state.queue.length ||
          state.queue.length < 2 ||
          !state.currentTrack
        ) {
          return;
        }

        const remainingQueue = state.queue.filter(
          (_, index) => index !== state.currentQueueIndex
        );
        const shuffledRemaining = remainingQueue.sort(
          () => Math.random() - 0.5
        );
        const newQueue = [state.currentTrack, ...shuffledRemaining];

        set({
          queue: newQueue,
          currentQueueIndex: 0,
          shuffleEnabled: true,
        });
      },

      unshuffle() {
        set({ shuffleEnabled: false });
      },

      // State Actions
      async setCurrentTrack(track: Track | null) {
        const state = get();

        if (!track) {
          $audio.cleanup();
          set({
            currentTrack: null,
            currentQueueIndex: -1,
            isPlaying: false,
            currentTime: 0,
            duration: 0,
            queue: [],
            isLoading: false,
            isError: false,
            errorMessage: null,
          });
          return;
        }

        // Avoid reloading the same track
        if (state.currentTrack?.id === track.id) {
          return;
        }

        const errorMessage = `Error: ${track.title || "Unknown track"}`;

        // Update queue with a single track
        set({
          currentTrack: track,
          queue: [track],
          currentQueueIndex: 0,
          isLoading: true,
          isPlaying: false,
          currentTime: 0,
          duration: 0,
          isError: false,
          errorMessage: null,
        });

        await loadAndPlayTrack({
          track,
          queueIndex: 0,
          set,
          errorMessage,
        });
      },
      setError: (message) => {
        set({
          isError: !!message,
          errorMessage: message,
          isLoading: false,
          isPlaying: false,
        });
      },
    })),
    {
      name: "audio:ui:store",
      partialize: (state) => ({
        currentTrack: state.currentTrack,
        queue: state.queue,
        history: state.history,
        volume: state.volume,
        isMuted: state.isMuted,
        repeatMode: state.repeatMode,
        shuffleEnabled: state.shuffleEnabled,
        currentTime: state.currentTime,
        insertMode: state.insertMode,
        currentQueueIndex: state.currentQueueIndex,
      }),
    }
  )
);

export {
  calculateNextIndex,
  calculatePreviousIndex,
  canUseDOM,
  useAudioStore,
  type AudioStore,
  type RepeatMode,
  type InsertMode,
};
