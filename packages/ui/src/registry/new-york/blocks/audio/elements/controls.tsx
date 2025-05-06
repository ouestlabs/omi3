"use client";

import {
  PlaybackState,
  useAudio
} from "@omi3/audio/react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";


type AudioControlsProps = React.ComponentProps<"div">

export function AudioControls({ className, ...props }: AudioControlsProps) {
  const {
    isPlaying,
    isLoading,
    isBuffering,
    playbackState,
    currentMusic,
    isEngineInitialized,
    play,
    pause,
  } = useAudio();

  const [isActionPending, setIsActionPending] = useState(false);
  const showSpinner = !isEngineInitialized || isLoading || isBuffering || isActionPending;

  const canPlayPause = useMemo(() =>
    isEngineInitialized && (
      playbackState === PlaybackState.READY ||
      playbackState === PlaybackState.PAUSED ||
      (playbackState === PlaybackState.IDLE && currentMusic != null)
    ),
    [isEngineInitialized, playbackState, currentMusic]
  );

  const isPlayPauseDisabled = isActionPending || (!isPlaying && !canPlayPause);

  const disablePrevious = !isEngineInitialized || true;
  const disableNext = !isEngineInitialized || true;

  const handlePlayPause = useCallback(async () => {
    if (isPlayPauseDisabled || isActionPending) { return; }

    setIsActionPending(true);
    try {
      if (isPlaying) {
        await Promise.resolve(pause());
      } else if (canPlayPause) {
        await Promise.resolve(play());
      }
    } catch (error) {
      console.error("Error during play/pause action:", error);
    } finally {
      setTimeout(() => setIsActionPending(false), 100);
    }
  }, [isPlayPauseDisabled, isActionPending, isPlaying, canPlayPause, pause, play]);

  const handlePrevious = useCallback(() => {
    if (!isEngineInitialized) { return; }
    console.log("Previous track requested (not implemented)");
  }, [isEngineInitialized]);

  const handleNext = useCallback(() => {
    if (!isEngineInitialized) { return; }
    console.log("Next track requested (not implemented)");
  }, [isEngineInitialized]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (event.key === " " && target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && target.tagName !== 'SELECT' && !target.isContentEditable) {
        event.preventDefault();
        handlePlayPause();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handlePlayPause]);

  return (
    <TooltipProvider delayDuration={100}>
      <div
        className={cn("flex items-center justify-center gap-2", className)}
        {...props}
        data-state={isPlaying ? "playing" : "paused"}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              disabled={disablePrevious}
              aria-label="Previous Track"
            >
              <SkipBack className="fill-current" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Previous Track</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              className="rounded-full"
              onClick={handlePlayPause}
              disabled={isPlayPauseDisabled}
              aria-label={isPlaying ? "Pause" : "Play"}
              aria-live="polite"
            >
              {showSpinner ? (
                <Spinner className="animate-spin" />
              ) : isPlaying ? (
                <Pause className="fill-current" />
              ) : (
                <Play className="fill-current" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isPlaying ? "Pause" : "Play"}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              disabled={disableNext}
              aria-label="Next Track"
            >
              <SkipForward className="fill-current" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Next Track</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
