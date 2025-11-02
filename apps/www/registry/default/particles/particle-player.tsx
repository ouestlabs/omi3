"use client";

import { MusicalNoteAiIcon, MusicPlaylistIcon } from "@audio-ui/icons";
import { useAudio } from "audio-engine/react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/registry/default/ui/button";
import {
  Dialog,
  DialogPopup,
  DialogTrigger,
} from "@/registry/default/ui/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/default/ui/empty";
import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/registry/default/ui/frame";
import { Group, GroupItem, GroupSeparator } from "@/registry/default/ui/group";
import { Input } from "@/registry/default/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/registry/default/ui/item";
import {
  exampleTracks,
  NextButton,
  Player,
  PlayerDuration,
  PlayerProgress,
  PlayerSpeed,
  PlayerTime,
  PlayerTrackInfo,
  PlayerVolume,
  PlayPauseButton,
  PreviousButton,
  SkipBackwardButton,
  SkipForwardButton,
} from "@/registry/default/ui/player";
import { ScrollArea } from "@/registry/default/ui/scroll-area";
import { Toggle } from "@/registry/default/ui/toggle";
import { Waveform } from "@/registry/default/ui/waveform";

const WaveformVisualizer = memo(
  ({
    isDark,
    precomputedWaveform,
    waveformElementRef,
    waveformOffset,
    totalBars,
    isScrubbing,
    isMomentumActive,
    audioData,
  }: {
    isDark: boolean;
    precomputedWaveform: number[];
    waveformElementRef: React.RefObject<HTMLDivElement | null>;
    waveformOffset: React.RefObject<number>;
    totalBars: React.RefObject<number>;
    isScrubbing: boolean;
    isMomentumActive: boolean;
    audioData: number[];
  }) => {
    // biome-ignore lint/correctness/useExhaustiveDependencies: refs ne doivent pas être dans les dépendances
    useEffect(() => {
      if (waveformElementRef.current) {
        waveformElementRef.current.style.transform = `translateX(${waveformOffset.current}px)`;
        waveformElementRef.current.style.transition =
          isScrubbing || isMomentumActive ? "none" : "transform 0.016s linear";
      }
    }, [isScrubbing, isMomentumActive]);

    return (
      <div
        ref={waveformElementRef}
        style={{
          transform: `translateX(${waveformOffset.current}px)`,
          transition:
            isScrubbing || isMomentumActive
              ? "none"
              : "transform 0.016s linear",
          width: `${totalBars.current * 5}px`,
          position: "absolute",
          left: 0,
        }}
      >
        <Waveform
          barColor={isDark ? "#a1a1aa" : "#71717a"}
          barGap={2}
          barRadius={1}
          barWidth={3}
          data={
            precomputedWaveform.length > 0 ? precomputedWaveform : audioData
          }
          fadeEdges={true}
          fadeWidth={24}
          height={32}
          key={isDark ? "dark" : "light"}
        />
      </div>
    );
  }
);

WaveformVisualizer.displayName = "Waveform.Visualizer";
const TrackListItem = function TrackListItem({
  track,
  index,
  isActive,
  onPlay,
}: {
  track: {
    id: string | number;
    title?: string;
    artist?: string;
    url: string;
    data?: unknown;
  };
  index: number;
  isActive: boolean;
  onPlay: (index: number) => void;
}) {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      onPlay(index);
      e.preventDefault();
    },
    [index, onPlay]
  );

  return (
    <Item
      className={cn("w-full px-2 py-1 transition-all hover:bg-secondary/50")}
      onClick={handleClick}
      size="sm"
      variant={isActive ? "muted" : "default"}
    >
      <ItemMedia>
        <span className="line-height-none text-muted-foreground/60 text-xs">
          {index + 1}
        </span>
      </ItemMedia>
      <ItemContent className="min-w-0 flex-1 gap-0 overflow-hidden">
        <ItemTitle className="truncate font-medium text-sm leading-snug">
          {track.title}
        </ItemTitle>
        <ItemDescription>{track.artist}</ItemDescription>
      </ItemContent>
      {isActive && (
        <ItemActions>
          <PlayPauseButton
            item={track}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            size="icon"
            variant="ghost"
          />
        </ItemActions>
      )}
    </Item>
  );
};

function Widget({ className }: { className?: string }) {
  const audio = useAudio();
  const engine = audio.state.status.engine;
  const isPlaying = audio.state.playback.isPlaying;
  const activeItemId = audio.state.queue.activeItemId;
  const play = audio.actions.playback.play;
  const pause = audio.actions.playback.pause;
  const setQueue = audio.actions.queue.setQueue;
  const setActiveItem = audio.actions.queue.setActiveItem;
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [precomputedWaveform, setPrecomputedWaveform] = useState<number[]>([]);
  const [ambienceMode, setAmbienceMode] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [isMomentumActive, setIsMomentumActive] = useState(false);
  const [audioData, setAudioData] = useState<number[]>([]);
  const containerWidthRef = useRef(300);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const totalBarsRef = useRef(600);
  const waveformOffset = useRef(0);
  const waveformElementRef = useRef<HTMLDivElement>(null);
  const scratchBufferRef = useRef<AudioBufferSourceNode | null>(null);
  const isPlayingRef = useRef(false);
  const isScrubbingRef = useRef(false);
  const isMomentumActiveRef = useRef(false);
  const lastAudioDataRef = useRef<number[]>([]);

  useEffect(() => {
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = document.querySelector(".waveform-container");
    if (container) {
      const rect = container.getBoundingClientRect();
      containerWidthRef.current = rect.width;
      waveformOffset.current = rect.width;
      if (waveformElementRef.current) {
        waveformElementRef.current.style.transform = `translateX(${rect.width}px)`;
      }
    }
  }, []);

  useEffect(() => {
    if (precomputedWaveform.length === 0 || containerWidthRef.current === 0) {
      return;
    }

    const audioEl = audio.state.status.audioElement;
    if (!audioEl) {
      return;
    }

    const calculateInitialOffset = () => {
      if (!Number.isNaN(audioEl.duration) && audioEl.duration > 0) {
        const currentTime = audioEl.currentTime;
        const duration = audioEl.duration;
        const position = Math.max(0, Math.min(1, currentTime / duration));
        const totalWidth = totalBarsRef.current * 5;
        return containerWidthRef.current - position * totalWidth;
      }
      return containerWidthRef.current;
    };

    const initialOffset = calculateInitialOffset();
    waveformOffset.current = initialOffset;
    if (waveformElementRef.current) {
      waveformElementRef.current.style.transform = `translateX(${initialOffset}px)`;
    }

    if (Number.isNaN(audioEl.duration) || audioEl.duration <= 0) {
      audioEl.currentTime = 0;
    }
  }, [precomputedWaveform, audio.state.status.audioElement]);

  const processChannelDataToWaveform = useCallback(
    (channelData: Float32Array, totalBars: number): number[] => {
      const samplesPerBar = Math.floor(channelData.length / totalBars);
      const waveformData: number[] = [];

      for (let i = 0; i < totalBars; i++) {
        const start = i * samplesPerBar;
        const end = start + samplesPerBar;
        let sum = 0;
        let count = 0;

        for (let j = start; j < end && j < channelData.length; j += 100) {
          const sample = channelData[j];
          if (sample !== undefined) {
            sum += Math.abs(sample);
            count++;
          }
        }

        const average = count > 0 ? sum / count : 0;
        waveformData.push(Math.min(1, average * 3));
      }

      return waveformData;
    },
    []
  );

  const precomputeWaveform = useCallback(
    async (audioUrl: string) => {
      try {
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();

        const offlineContext = new OfflineAudioContext(1, 44_100 * 5, 44_100);
        const offlineBuffer = await offlineContext.decodeAudioData(
          arrayBuffer.slice(0)
        );

        const audioContext = audio.state.status.audioContext;
        if (!audioContext) {
          console.warn("Audio context not available yet");
          return;
        }

        if (audioContext.state === "suspended") {
          await audioContext.resume();
        }

        audioBufferRef.current =
          await audioContext.decodeAudioData(arrayBuffer);

        const channelData = offlineBuffer.getChannelData(0);
        const waveformData = processChannelDataToWaveform(
          channelData,
          totalBarsRef.current
        );

        setPrecomputedWaveform(waveformData);
      } catch (error) {
        console.error("Error precomputing waveform:", error);
      }
    },
    [processChannelDataToWaveform, audio.state.status.audioContext]
  );

  useEffect(() => {
    setQueue(exampleTracks);
    const firstTrack = exampleTracks[0];
    if (firstTrack) {
      setActiveItem(firstTrack.id);
      precomputeWaveform(firstTrack.url);
    }
  }, [precomputeWaveform, setQueue, setActiveItem]);

  useEffect(() => {
    const handlePlay = () => {
      isPlayingRef.current = true;
    };
    const handlePause = () => {
      isPlayingRef.current = false;
    };

    const checkInterval = setInterval(() => {
      const audioEl = audio.state.status.audioElement;
      if (audioEl) {
        clearInterval(checkInterval);

        audioEl.addEventListener("play", handlePlay);
        audioEl.addEventListener("pause", handlePause);
        audioEl.addEventListener("ended", handlePause);

        if (!audioEl.paused) {
          handlePlay();
        }
      }
    }, 100);

    return () => {
      clearInterval(checkInterval);
      const audioEl = audio.state.status.audioElement;
      if (audioEl) {
        audioEl.removeEventListener("play", handlePlay);
        audioEl.removeEventListener("pause", handlePause);
        audioEl.removeEventListener("ended", handlePause);
      }
    };
  }, [audio.state.status.audioElement]);

  useEffect(() => {
    let animationId: number;

    const checkDataChanged = (
      newData: number[],
      oldData: number[]
    ): boolean => {
      if (newData.length !== oldData.length) {
        return true;
      }
      return newData.some(
        (val, idx) => Math.abs(val - (oldData[idx] ?? 0)) > 0.01
      );
    };

    const processPlayingAudio = (
      analyserNode: AnalyserNode,
      ctx: AudioContext
    ) => {
      if (ctx.state === "suspended") {
        ctx.resume().catch((error) => {
          console.error("Failed to resume audio context:", error);
        });
      }

      const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
      analyserNode.getByteFrequencyData(dataArray);
      const normalizedData = Array.from(dataArray).map((value) => value / 255);

      if (checkDataChanged(normalizedData, lastAudioDataRef.current)) {
        lastAudioDataRef.current = normalizedData;
        setAudioData(normalizedData);
      }
    };

    const processFadeOut = () => {
      const fadedData = lastAudioDataRef.current.map((v) => v * 0.9);
      const hasSignificantValue = fadedData.some((v) => v > 0.01);

      if (hasSignificantValue) {
        lastAudioDataRef.current = fadedData;
        setAudioData(fadedData);
      } else {
        lastAudioDataRef.current = [];
        setAudioData([]);
      }
    };

    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: fonction nécessite cette logique pour gérer l'animation waveform
    const updateWaveform = () => {
      const analyserNode = audio.state.status.analyserNode;
      const ctx = audio.state.status.audioContext;
      const currentlyPlaying = audio.state.playback.isPlaying;
      const hasNoData = lastAudioDataRef.current.length === 0;

      if (!currentlyPlaying && hasNoData) {
        return;
      }

      const shouldProcessAudio = analyserNode && ctx && currentlyPlaying;
      if (shouldProcessAudio) {
        processPlayingAudio(analyserNode, ctx);
        animationId = requestAnimationFrame(updateWaveform);
        return;
      }

      const shouldFadeOut = !(currentlyPlaying || hasNoData);
      if (shouldFadeOut) {
        processFadeOut();
        if (lastAudioDataRef.current.length === 0) {
          return;
        }
      }

      animationId = requestAnimationFrame(updateWaveform);
    };

    animationId = requestAnimationFrame(updateWaveform);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [
    audio.state.status.analyserNode,
    audio.state.status.audioContext,
    audio.state.playback.isPlaying,
  ]);

  useEffect(() => {
    isScrubbingRef.current = isScrubbing;
  }, [isScrubbing]);

  useEffect(() => {
    isMomentumActiveRef.current = isMomentumActive;
  }, [isMomentumActive]);

  const stopScratchSound = useCallback(() => {
    if (scratchBufferRef.current) {
      try {
        scratchBufferRef.current.stop();
      } catch {
        // Already stopped
      }
      scratchBufferRef.current = null;
    }
  }, []);

  const playScratchSound = useCallback(
    (position: number, speed = 1) => {
      if (!audio.state.status.audioContext) {
        return;
      }

      if (audio.state.status.audioContext.state === "suspended") {
        audio.state.status.audioContext.resume();
      }

      if (!audioBufferRef.current) {
        return;
      }

      stopScratchSound();

      try {
        const source = audio.state.status.audioContext.createBufferSource();
        source.buffer = audioBufferRef.current;

        const startTime = Math.max(
          0,
          Math.min(
            audioBufferRef.current.duration - 0.1,
            position * audioBufferRef.current.duration
          )
        );

        const filter = audio.state.status.audioContext.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = Math.max(800, 2500 - speed * 1500);
        filter.Q.value = 3;

        source.playbackRate.value = Math.max(
          0.4,
          Math.min(2.5, 1 + speed * 0.5)
        );

        const gainNode = audio.state.status.audioContext.createGain();
        gainNode.gain.value = 1.0;

        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audio.state.status.audioContext.destination);

        source.start(0, startTime, 0.06);

        scratchBufferRef.current = source;
      } catch (error) {
        console.error("Error playing scratch sound:", error);
      }
    },
    [stopScratchSound, audio.state.status.audioContext]
  );

  const effects = useMemo(
    () => [
      {
        id: "reverb",
        type: "reverb" as const,
        enabled: true,
        roomSize: 6,
        decay: 1.5,
        wet: ambienceMode ? 0.85 : 0,
        dry: ambienceMode ? 0.4 : 1,
      },
      {
        id: "delay",
        type: "delay" as const,
        enabled: true,
        delayTime: ambienceMode ? 0.25 : 0.001,
        feedback: ambienceMode ? 0.25 : 0.05,
      },
      {
        id: "highpass",
        type: "filter" as const,
        enabled: true,
        filterType: "highpass" as const,
        frequency: ambienceMode ? 200 : 100,
        Q: 0.7,
      },
      {
        id: "lowpass",
        type: "filter" as const,
        enabled: true,
        filterType: "lowpass" as const,
        frequency: ambienceMode ? 800 : 1500,
        Q: ambienceMode ? 0.7 : 0.5,
      },
      {
        id: "compressor",
        type: "compressor" as const,
        enabled: true,
        threshold: -12,
        knee: 2,
        ratio: 8,
        attack: 0.003,
        release: 0.1,
      },
    ],
    [ambienceMode]
  );

  useEffect(() => {
    audio.effects.apply(effects);
  }, [audio.effects, effects]);

  const currentPosition = useMemo(() => {
    const { currentTime, duration } = {
      currentTime: audio.state.playback.currentTime,
      duration: audio.state.playback.duration,
    };
    if (
      !Number.isFinite(duration) ||
      duration <= 0 ||
      !Number.isFinite(currentTime)
    ) {
      return 0;
    }
    return Math.max(
      0,
      Math.min(100, Math.round((currentTime / duration) * 100))
    );
  }, [audio.state.playback.currentTime, audio.state.playback.duration]);

  useEffect(() => {
    const audioEl = audio.state.status.audioElement;
    if (!audioEl) {
      return;
    }

    const isCurrentlyPlaying = audio.state.playback.isPlaying;
    const canStartAnimation =
      !(isScrubbing || isMomentumActive) &&
      (isCurrentlyPlaying || audioEl.currentTime > 0);

    if (!canStartAnimation) {
      return;
    }

    let animationId: number;

    const calculateWaveformOffset = (
      currentTime: number,
      duration: number
    ): number => {
      const position = currentTime / duration;
      const containerWidth = containerWidthRef.current;
      const totalWidth = totalBarsRef.current * 5;
      return containerWidth - position * totalWidth;
    };

    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: fonction nécessite cette logique pour gérer l'animation
    const updatePosition = () => {
      const currentAudioEl = audio.state.status.audioElement;
      const isPlayingNow = audio.state.playback.isPlaying;
      const isNotScrubbing = !(isScrubbing || isMomentumActive);
      const hasValidElements =
        currentAudioEl !== null && waveformElementRef.current !== null;
      const shouldUpdate = isNotScrubbing && hasValidElements && isPlayingNow;

      if (shouldUpdate) {
        const duration = currentAudioEl.duration;
        const currentTime = currentAudioEl.currentTime;

        if (!Number.isNaN(duration) && duration > 0) {
          const newOffset = calculateWaveformOffset(currentTime, duration);
          waveformOffset.current = newOffset;
          if (waveformElementRef.current) {
            waveformElementRef.current.style.transform = `translateX(${newOffset}px)`;
          }
        }
      }

      const shouldStop = !isPlayingNow && isNotScrubbing;
      if (shouldStop) {
        return;
      }

      animationId = requestAnimationFrame(updatePosition);
    };

    animationId = requestAnimationFrame(updatePosition);
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [
    audio.state.status.audioElement,
    audio.state.playback.isPlaying,
    isScrubbing,
    isMomentumActive,
  ]);

  const playTrack = useCallback(
    (index: number) => {
      const exampleTrack = exampleTracks[index];
      if (!exampleTrack) {
        return;
      }
      setCurrentTrackIndex(index);
      const track = {
        id: exampleTrack.id,
        title: exampleTrack.title,
        url: exampleTrack.url,
        data: exampleTrack.data,
      };
      play(track);
      precomputeWaveform(track.url);
      setDialogOpen(false);
    },
    [play, precomputeWaveform]
  );

  const tracks = useMemo(
    () =>
      exampleTracks.map((t) => ({
        id: t.id,
        title: t.title,
        artist: "Audio UI",
        url: t.url,
        data: t.data,
      })),
    []
  );
  const filteredTracks = useMemo(() => {
    if (!searchQuery.trim()) {
      return tracks;
    }
    const query = searchQuery.toLowerCase();
    return tracks.filter(
      (track) =>
        track.title?.toLowerCase().includes(query) ||
        track.artist?.toLowerCase().includes(query)
    );
  }, [tracks, searchQuery]);

  const currentQueueItem = useMemo(() => {
    const track = exampleTracks[currentTrackIndex];
    if (!track) {
      return;
    }
    return {
      id: track.id,
      title: track.title,
      url: track.url,
      data: track.data,
    };
  }, [currentTrackIndex]);

  const playPauseVariant = useMemo(
    () =>
      isPlaying && activeItemId === exampleTracks[currentTrackIndex]?.id
        ? "outline"
        : "default",
    [isPlaying, activeItemId, currentTrackIndex]
  );

  return (
    <Frame className={cn("relative", className)}>
      <FrameHeader>
        <FrameTitle>Player</FrameTitle>
      </FrameHeader>
      <FramePanel className="relative space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-end">
            <Group>
              <GroupItem render={<PlayerSpeed />} />
              <GroupSeparator />

              <Dialog
                onOpenChange={(open) => {
                  setDialogOpen(open);
                  if (!open) {
                    setSearchQuery("");
                  }
                }}
                open={dialogOpen}
              >
                <DialogTrigger
                  render={
                    <GroupItem
                      render={<Button size="icon" variant="outline" />}
                    />
                  }
                >
                  <MusicPlaylistIcon />
                </DialogTrigger>
                <DialogPopup
                  aria-label="Sélectionner une piste"
                  className="p-0!"
                  showCloseButton={false}
                >
                  <Frame>
                    <FrameHeader>
                      <Input
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher une piste..."
                        type="search"
                        value={searchQuery}
                      />
                    </FrameHeader>

                    <FramePanel className="p-1.5!">
                      <ScrollArea className="no-scrollbar max-h-[50vh] space-y-1 p-3">
                        {filteredTracks.length > 0 ? (
                          filteredTracks.map((track) => {
                            const index = tracks.findIndex(
                              (t) => t.id === track.id
                            );
                            return (
                              <TrackListItem
                                index={index}
                                isActive={currentTrackIndex === index}
                                key={track.id}
                                onPlay={playTrack}
                                track={track}
                              />
                            );
                          })
                        ) : (
                          <Empty className="flex h-full flex-col items-center justify-center gap-3 border bg-muted/20 p-3">
                            <EmptyHeader>
                              <EmptyMedia variant="icon">
                                <MusicPlaylistIcon className="size-6" />
                              </EmptyMedia>
                              <EmptyTitle>No tracks found</EmptyTitle>
                              <EmptyDescription>
                                Try searching for a different track.
                              </EmptyDescription>
                            </EmptyHeader>
                          </Empty>
                        )}
                      </ScrollArea>
                    </FramePanel>
                  </Frame>
                </DialogPopup>
              </Dialog>
              <GroupSeparator />
              <GroupItem
                render={
                  <Toggle
                    onClick={() => setAmbienceMode(!ambienceMode)}
                    variant="outline"
                  />
                }
              >
                <MusicalNoteAiIcon />
              </GroupItem>
            </Group>
          </div>

          <div
            aria-label="Audio playback position"
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={currentPosition}
            className="waveform-container relative h-12 cursor-grab overflow-hidden rounded-lg bg-foreground/10 p-2 active:cursor-grabbing dark:bg-black/80"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsScrubbing(true);

              const wasPlaying = isPlayingRef.current;

              if (isPlayingRef.current) {
                pause();
              }

              const rect = e.currentTarget.getBoundingClientRect();
              const startX = e.clientX;
              const containerWidth = rect.width;
              containerWidthRef.current = containerWidth;
              const totalWidth = totalBarsRef.current * 5;
              const currentOffset = waveformOffset.current;
              let lastMouseX = startX;
              let lastScratchTime = 0;
              const scratchThrottle = 10;

              let velocity = 0;
              let lastTime = Date.now();
              let lastClientX = e.clientX;

              const handleMove = (moveEvent: MouseEvent) => {
                const deltaX = moveEvent.clientX - startX;
                const newOffset = currentOffset + deltaX;

                const minOffset = containerWidth - totalWidth;
                const maxOffset = containerWidth;
                const clampedOffset = Math.max(
                  minOffset,
                  Math.min(maxOffset, newOffset)
                );
                waveformOffset.current = clampedOffset;
                if (waveformElementRef.current) {
                  waveformElementRef.current.style.transform = `translateX(${clampedOffset}px)`;
                }

                const position = Math.max(
                  0,
                  Math.min(1, (containerWidth - clampedOffset) / totalWidth)
                );

                const audioEl = audio.state.status.audioElement;
                if (audioEl && !Number.isNaN(audioEl.duration)) {
                  audioEl.currentTime = position * audioEl.duration;
                }

                const now = Date.now();
                const mouseDelta = moveEvent.clientX - lastMouseX;

                const timeDelta = now - lastTime;
                if (timeDelta > 0) {
                  const instantVelocity =
                    (moveEvent.clientX - lastClientX) / timeDelta;
                  velocity = velocity * 0.6 + instantVelocity * 0.4;
                }
                lastTime = now;
                lastClientX = moveEvent.clientX;

                if (
                  Math.abs(mouseDelta) > 0 &&
                  now - lastScratchTime >= scratchThrottle
                ) {
                  const speed = Math.min(3, Math.abs(mouseDelta) / 3);
                  playScratchSound(position, speed);
                  lastScratchTime = now;
                }
                lastMouseX = moveEvent.clientX;
              };

              const handleUp = () => {
                setIsScrubbing(false);
                stopScratchSound();

                if (Math.abs(velocity) > 0.1) {
                  setIsMomentumActive(true);
                  let momentumOffset = waveformOffset.current;
                  let currentVelocity = velocity * 15;
                  const friction = 0.92;
                  const minVelocity = 0.5;
                  let lastScratchFrame = 0;
                  const scratchFrameInterval = 50;

                  const clampMomentumOffset = (
                    offset: number
                  ): { clamped: number; hitBoundary: boolean } => {
                    const minOffset = containerWidth - totalWidth;
                    const maxOffset = containerWidth;
                    const clamped = Math.max(
                      minOffset,
                      Math.min(maxOffset, offset)
                    );
                    return {
                      clamped,
                      hitBoundary: clamped !== offset,
                    };
                  };

                  const updateWaveformAndAudio = (offset: number) => {
                    waveformOffset.current = offset;
                    if (waveformElementRef.current) {
                      waveformElementRef.current.style.transform = `translateX(${offset}px)`;
                    }

                    const position = Math.max(
                      0,
                      Math.min(1, (containerWidth - offset) / totalWidth)
                    );

                    const audioEl = engine?.audioElement;
                    if (audioEl && !Number.isNaN(audioEl.duration)) {
                      audioEl.currentTime = position * audioEl.duration;
                    }

                    return position;
                  };

                  const handleMomentumScratchSound = (
                    position: number,
                    vel: number,
                    now: number
                  ) => {
                    if (now - lastScratchFrame >= scratchFrameInterval) {
                      const speed = Math.min(2.5, Math.abs(vel) / 10);
                      if (speed > 0.1) {
                        playScratchSound(position, speed);
                      }
                      lastScratchFrame = now;
                    }
                  };

                  const stopMomentum = () => {
                    stopScratchSound();
                    setIsMomentumActive(false);
                    if (wasPlaying) {
                      setTimeout(() => {
                        play();
                      }, 10);
                    }
                  };

                  const animateMomentum = () => {
                    if (Math.abs(currentVelocity) > minVelocity) {
                      momentumOffset += currentVelocity;
                      currentVelocity *= friction;

                      const { clamped, hitBoundary } =
                        clampMomentumOffset(momentumOffset);
                      if (hitBoundary) {
                        currentVelocity = 0;
                      }

                      momentumOffset = clamped;
                      const position = updateWaveformAndAudio(clamped);

                      const now = Date.now();
                      handleMomentumScratchSound(
                        position,
                        currentVelocity,
                        now
                      );

                      requestAnimationFrame(animateMomentum);
                    } else {
                      stopMomentum();
                    }
                  };

                  requestAnimationFrame(animateMomentum);
                } else if (wasPlaying) {
                  play();
                }

                document.removeEventListener("mousemove", handleMove);
                document.removeEventListener("mouseup", handleUp);
              };

              document.addEventListener("mousemove", handleMove);
              document.addEventListener("mouseup", handleUp);
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              setIsScrubbing(true);

              const wasPlaying = isPlayingRef.current;

              if (isPlayingRef.current) {
                pause();
              }

              const touch = e.touches[0];
              if (!touch) {
                return;
              }

              const rect = e.currentTarget.getBoundingClientRect();
              const startX = touch.clientX;
              const containerWidth = rect.width;
              containerWidthRef.current = containerWidth;
              const totalWidth = totalBarsRef.current * 5;
              const currentOffset = waveformOffset.current;
              let lastTouchX = startX;
              let lastScratchTime = 0;
              const scratchThrottle = 10;

              let velocity = 0;
              let lastTime = Date.now();
              let lastClientX = touch.clientX;

              const clampTouchOffset = (offset: number) => {
                const minOffset = containerWidth - totalWidth;
                const maxOffset = containerWidth;
                return Math.max(minOffset, Math.min(maxOffset, offset));
              };

              const updateTouchWaveformAndAudio = (offset: number) => {
                waveformOffset.current = offset;
                if (waveformElementRef.current) {
                  waveformElementRef.current.style.transform = `translateX(${offset}px)`;
                }

                const position = Math.max(
                  0,
                  Math.min(1, (containerWidth - offset) / totalWidth)
                );

                const audioEl = audio.state.status.audioElement;
                if (audioEl && !Number.isNaN(audioEl.duration)) {
                  audioEl.currentTime = position * audioEl.duration;
                }

                return position;
              };

              const updateTouchVelocity = (
                clientX: number,
                now: number
              ): number => {
                const timeDelta = now - lastTime;
                if (timeDelta > 0) {
                  const instantVelocity = (clientX - lastClientX) / timeDelta;
                  velocity = velocity * 0.6 + instantVelocity * 0.4;
                }
                lastTime = now;
                lastClientX = clientX;
                return velocity;
              };

              const handleMove = (moveEvent: TouchEvent) => {
                const moveTouch = moveEvent.touches[0];
                if (!moveTouch) {
                  return;
                }
                const deltaX = moveTouch.clientX - startX;
                const newOffset = currentOffset + deltaX;
                const clampedOffset = clampTouchOffset(newOffset);
                const position = updateTouchWaveformAndAudio(clampedOffset);

                const now = Date.now();
                updateTouchVelocity(moveTouch.clientX, now);

                const touchDelta = moveTouch.clientX - lastTouchX;
                if (
                  Math.abs(touchDelta) > 0 &&
                  now - lastScratchTime >= scratchThrottle
                ) {
                  const speed = Math.min(3, Math.abs(touchDelta) / 3);
                  playScratchSound(position, speed);
                  lastScratchTime = now;
                }
                lastTouchX = moveTouch.clientX;
              };

              const handleEnd = () => {
                setIsScrubbing(false);
                stopScratchSound();

                if (Math.abs(velocity) > 0.1) {
                  setIsMomentumActive(true);
                  let momentumOffset = waveformOffset.current;
                  let currentVelocity = velocity * 15;
                  const friction = 0.92;
                  const minVelocity = 0.5;
                  let lastScratchFrame = 0;
                  const scratchFrameInterval = 50;

                  const clampMomentumOffset = (
                    offset: number
                  ): { clamped: number; hitBoundary: boolean } => {
                    const minOffset = containerWidth - totalWidth;
                    const maxOffset = containerWidth;
                    const clamped = Math.max(
                      minOffset,
                      Math.min(maxOffset, offset)
                    );
                    return {
                      clamped,
                      hitBoundary: clamped !== offset,
                    };
                  };

                  const updateWaveformAndAudio = (offset: number) => {
                    waveformOffset.current = offset;
                    if (waveformElementRef.current) {
                      waveformElementRef.current.style.transform = `translateX(${offset}px)`;
                    }

                    const position = Math.max(
                      0,
                      Math.min(1, (containerWidth - offset) / totalWidth)
                    );

                    const audioEl = engine?.audioElement;
                    if (audioEl && !Number.isNaN(audioEl.duration)) {
                      audioEl.currentTime = position * audioEl.duration;
                    }

                    return position;
                  };

                  const handleMomentumScratchSound = (
                    position: number,
                    vel: number,
                    now: number
                  ) => {
                    if (now - lastScratchFrame >= scratchFrameInterval) {
                      const speed = Math.min(2.5, Math.abs(vel) / 10);
                      if (speed > 0.1) {
                        playScratchSound(position, speed);
                      }
                      lastScratchFrame = now;
                    }
                  };

                  const stopMomentum = () => {
                    stopScratchSound();
                    setIsMomentumActive(false);
                    if (wasPlaying) {
                      setTimeout(() => {
                        play();
                      }, 10);
                    }
                  };

                  const animateMomentum = () => {
                    if (Math.abs(currentVelocity) > minVelocity) {
                      momentumOffset += currentVelocity;
                      currentVelocity *= friction;

                      const { clamped, hitBoundary } =
                        clampMomentumOffset(momentumOffset);
                      if (hitBoundary) {
                        currentVelocity = 0;
                      }

                      momentumOffset = clamped;
                      const position = updateWaveformAndAudio(clamped);

                      const now = Date.now();
                      handleMomentumScratchSound(
                        position,
                        currentVelocity,
                        now
                      );

                      requestAnimationFrame(animateMomentum);
                    } else {
                      stopMomentum();
                    }
                  };

                  requestAnimationFrame(animateMomentum);
                } else if (wasPlaying) {
                  play();
                }

                document.removeEventListener("touchmove", handleMove);
                document.removeEventListener("touchend", handleEnd);
              };

              document.addEventListener("touchmove", handleMove);
              document.addEventListener("touchend", handleEnd);
            }}
            role="slider"
            tabIndex={0}
          >
            <div className="relative h-full w-full overflow-hidden">
              <WaveformVisualizer
                audioData={audioData}
                isDark={isDark}
                isMomentumActive={isMomentumActive}
                isScrubbing={isScrubbing}
                precomputedWaveform={precomputedWaveform}
                totalBars={totalBarsRef}
                waveformElementRef={waveformElementRef}
                waveformOffset={waveformOffset}
              />
            </div>
          </div>
          <div className="flex w-full items-center justify-center gap-2">
            <PlayerTime className="text-xs" />
            <PlayerProgress className="flex-1" />
            <PlayerDuration className="text-xs" />
          </div>
          <div className="flex items-center gap-2">
            <PlayerTrackInfo />
            <div className="flex justify-center gap-2">
              <PreviousButton />
              <SkipBackwardButton />
              <PlayPauseButton
                item={currentQueueItem}
                variant={playPauseVariant}
              />
              <SkipForwardButton />
              <NextButton />
              <PlayerVolume />
            </div>
          </div>
        </div>
      </FramePanel>
    </Frame>
  );
}

export default function AudioPlayerWidget({
  className,
}: {
  className?: string;
}) {
  return (
    <Player>
      <Widget className={className} />
    </Player>
  );
}
