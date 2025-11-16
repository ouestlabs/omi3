import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { $audio, isLive, type Track } from "@/registry/default/lib/audio";

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
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  changeRepeatMode: () => void;
  setInsertMode: (mode: InsertMode) => void;
  shuffle: () => void;
  unshuffle: () => void;
  setRepeatMode: (mode: RepeatMode) => void;

  // State Actions
  setCurrentTrack: (track: Track | null) => void;
  setError: (message: string | null) => void;
};

function canUseDOM() {
  return !!(
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
  );
}

const calculateNextIndex = (
  queue: Track[],
  currentQueueIndex: number,
  shuffleEnabled: boolean,
  repeatMode: RepeatMode
): number => {
  if (queue.length === 0) {
    return -1;
  }

  if (shuffleEnabled) {
    if (queue.length === 1) {
      return repeatMode === "none" ? -1 : 0;
    }
    let randomIndex: number;
    do {
      randomIndex = Math.floor(Math.random() * queue.length);
    } while (randomIndex === currentQueueIndex);
    return randomIndex;
  }

  let nextIndex = currentQueueIndex + 1;
  if (nextIndex >= queue.length) {
    if (repeatMode === "all") {
      nextIndex = 0;
    } else {
      return -1;
    }
  }

  return nextIndex >= 0 && nextIndex < queue.length ? nextIndex : -1;
};

const calculatePreviousIndex = (
  queue: Track[],
  currentQueueIndex: number,
  shuffleEnabled: boolean,
  repeatMode: RepeatMode
): number => {
  if (queue.length === 0) {
    return -1;
  }

  if (shuffleEnabled) {
    if (queue.length === 1) {
      return repeatMode === "none" ? -1 : 0;
    }
    let randomIndex: number;
    do {
      randomIndex = Math.floor(Math.random() * queue.length);
    } while (randomIndex === currentQueueIndex);
    return randomIndex;
  }

  let prevIndex = currentQueueIndex - 1;
  if (prevIndex < 0) {
    if (repeatMode === "all") {
      prevIndex = queue.length - 1;
    } else {
      return -1;
    }
  }

  return prevIndex >= 0 && prevIndex < queue.length ? prevIndex : -1;
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
        const nextIndex = calculateNextIndex(
          state.queue,
          state.currentQueueIndex,
          state.shuffleEnabled,
          state.repeatMode
        );

        if (nextIndex === -1 || !state.queue[nextIndex]) {
          $audio.pause();
          set({ isLoading: false, isPlaying: false, isBuffering: false });
          return;
        }

        const nextSong = state.queue[nextIndex];
        const isLiveStream = isLive(nextSong);

        set({ isLoading: true, isBuffering: true });
        try {
          set({
            currentTrack: nextSong,
            currentQueueIndex: nextIndex,
          });
          await $audio.load(nextSong.url, 0, isLiveStream);
          await $audio.play();
          set({
            isLoading: false,
            isError: false,
            errorMessage: null,
            isBuffering: false,
          });
        } catch {
          set({
            isLoading: false,
            isPlaying: false,
            isError: true,
            errorMessage: "Error loading/playing next track",
            isBuffering: false,
          });
        }
      },

      async previous() {
        const state = get();
        const currentTime = $audio.getCurrentTime();

        if (currentTime > 3 && !state.shuffleEnabled) {
          set({ isLoading: true });
          try {
            $audio.setCurrentTime(0);
            set({ currentTime: 0, progress: 0, isLoading: false });
            return;
          } catch (error) {
            console.error("Error restarting current track:", error);
            set({ isLoading: false });
          }
        }

        const prevIndex = calculatePreviousIndex(
          state.queue,
          state.currentQueueIndex,
          state.shuffleEnabled,
          state.repeatMode
        );

        if (prevIndex === -1 || !state.queue[prevIndex]) {
          if (prevIndex !== -1) {
            console.error(
              "Inconsistency: previous index is valid but track not found"
            );
          }
          $audio.pause();
          set({ isLoading: false, isPlaying: false, isBuffering: false });
          return;
        }

        const prevSong = state.queue[prevIndex];
        const isLiveStream = isLive(prevSong);

        set({ isLoading: true, isBuffering: true });
        try {
          set({
            currentTrack: prevSong,
            currentQueueIndex: prevIndex,
          });
          await $audio.load(prevSong.url, 0, isLiveStream);
          await $audio.play();
          set({
            isLoading: false,
            isError: false,
            errorMessage: null,
            isBuffering: false,
          });
        } catch (error) {
          console.error("Store Previous track error (load/play):", error);
          set({
            isLoading: false,
            isPlaying: false,
            isError: true,
            errorMessage: "Error loading/playing previous track",
            isBuffering: false,
          });
        }
      },

      seek(time: number) {
        $audio.setCurrentTime(time);
        set({ currentTime: time });
      },

      async setQueueAndPlay(songs: Track[], startIndex: number) {
        const targetSong = songs[startIndex];
        if (!targetSong) {
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

        const isLiveStream = isLive(targetSong);
        set({ isLoading: true, isBuffering: true });
        try {
          set({
            currentTrack: targetSong,
            currentQueueIndex: startIndex,
          });
          await $audio.load(targetSong.url, 0, isLiveStream);
          await $audio.play();
          set({
            isLoading: false,
            isPlaying: true,
            isError: false,
            errorMessage: null,
            isBuffering: false,
          });
        } catch (error) {
          console.error(
            "[Playback] Error in setQueueAndPlay (load/play):",
            error
          );
          set({
            isLoading: false,
            isPlaying: false,
            isError: true,
            errorMessage: `Error playing ${targetSong.title}`,
            isBuffering: false,
          });
        }
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
      setVolume(volume) {
        $audio.setVolume(volume);
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
      setCurrentTrack: (track: Track | null) => {
        const performSetCurrentTrack = async () => {
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

          if (state.currentTrack?.id === track.id) {
            return;
          }

          const isLiveStream = isLive(track);

          try {
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

            await $audio.load(track.url, 0, isLiveStream);
            await $audio.play();
          } catch (error) {
            console.error("Error setting single current track:", error);
            set({
              isLoading: false,
              isPlaying: false,
              isError: true,
              errorMessage: `Error: ${error instanceof Error ? error.message : "Unknown"}`,
            });
          }
        };

        performSetCurrentTrack();
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
