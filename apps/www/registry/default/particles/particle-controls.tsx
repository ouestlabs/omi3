"use client";

import { NextIcon, PauseIcon, PlayIcon, PreviousIcon } from "@audio-ui/icons";
import { PlaybackState, useAudio } from "audio-engine/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/registry/default/ui/button";
import { Spinner } from "@/registry/default/ui/spinner";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/registry/default/ui/tooltip";

const ACTION_PENDING_DELAY = 100;

type AudioControlsProps = React.ComponentProps<"div">;

function AudioControls({ className, ...props }: AudioControlsProps) {
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
  const showSpinner =
    !isEngineInitialized || isLoading || isBuffering || isActionPending;

  const canPlayPause = useMemo(
    () =>
      isEngineInitialized &&
      (playbackState === PlaybackState.READY ||
        playbackState === PlaybackState.PAUSED ||
        (playbackState === PlaybackState.IDLE && currentMusic != null)),
    [isEngineInitialized, playbackState, currentMusic]
  );

  const isPlayPauseDisabled = isActionPending || !(isPlaying || canPlayPause);

  const disablePrevious = true;
  const disableNext = true;

  const handlePlayPause = useCallback(async () => {
    if (isPlayPauseDisabled || isActionPending) {
      return;
    }

    setIsActionPending(true);
    if (isPlaying) {
      await Promise.resolve(pause());
    } else if (canPlayPause) {
      await Promise.resolve(play());
    }
    setTimeout(() => setIsActionPending(false), ACTION_PENDING_DELAY);
  }, [
    isPlayPauseDisabled,
    isActionPending,
    isPlaying,
    canPlayPause,
    pause,
    play,
  ]);

  const handlePrevious = useCallback(() => {
    if (!isEngineInitialized) {
      return;
    }
  }, [isEngineInitialized]);

  const handleNext = useCallback(() => {
    if (!isEngineInitialized) {
      return;
    }
  }, [isEngineInitialized]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        event.key === " " &&
        target.tagName !== "INPUT" &&
        target.tagName !== "TEXTAREA" &&
        target.tagName !== "SELECT" &&
        !target.isContentEditable
      ) {
        event.preventDefault();
        handlePlayPause();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handlePlayPause]);

  const renderPlayPauseIcon = () => {
    if (showSpinner) {
      return <Spinner />;
    }
    if (isPlaying) {
      return <PauseIcon />;
    }
    return <PlayIcon />;
  };

  return (
    <div
      className={cn("flex items-center justify-center gap-2", className)}
      {...props}
      data-state={isPlaying ? "playing" : "paused"}
    >
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              aria-label="Previous Track"
              disabled={disablePrevious}
              onClick={handlePrevious}
              size="icon"
              variant="ghost"
            />
          }
        >
          <PreviousIcon />
        </TooltipTrigger>
        <TooltipPopup>
          <p>Previous Track</p>
        </TooltipPopup>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              aria-label={isPlaying ? "Pause" : "Play"}
              aria-live="polite"
              className="rounded-full"
              disabled={isPlayPauseDisabled}
              onClick={handlePlayPause}
              size="icon"
            />
          }
        >
          {renderPlayPauseIcon()}
        </TooltipTrigger>
        <TooltipPopup>
          <p>{isPlaying ? "Pause" : "Play"}</p>
        </TooltipPopup>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              aria-label="Next Track"
              disabled={disableNext}
              onClick={handleNext}
              size="icon"
              variant="ghost"
            />
          }
        >
          <NextIcon />
        </TooltipTrigger>
        <TooltipPopup>
          <p>Next Track</p>
        </TooltipPopup>
      </Tooltip>
    </div>
  );
}

export default AudioControls;
