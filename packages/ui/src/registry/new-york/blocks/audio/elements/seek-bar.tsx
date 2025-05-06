"use client";

import {
  useAudioTime,
  PlaybackState,
  useAudio
} from "@omi3/audio/react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { formatDuration, formatSecondsToISO8601 } from "@omi3/utils";
import { useEffect, useState } from "react";

type AudioSeekBarProps = React.ComponentProps<typeof Slider> & {
  className?: string;
};

export function AudioSeekBar({ className, ...props }: AudioSeekBarProps) {
  const {
    currentTime,
    duration
  } = useAudioTime();
  const {
    playbackState,
    error,
    isEngineInitialized,
    seek,
  } = useAudio();

  const [isDragging, setIsDragging] = useState(false);
  const [internalTime, setInternalTime] = useState(currentTime);

  useEffect(() => {
    if (!isDragging) {
      setInternalTime(currentTime);
    }
  }, [currentTime, isDragging]);

  useEffect(() => {
    if (duration === 0 && internalTime !== 0) {
      setInternalTime(0);
    }
  }, [duration, internalTime]);

  const handleValueChange = (value: number[]) => {
    const newTime = value[0];
    if (newTime !== undefined) {
      setInternalTime(newTime);
      if (!isDragging) {
        setIsDragging(true);
      }
      if (isDragging && isEngineInitialized) {
        seek(newTime);
      }
    }
  };

  const handlePointerDown = () => {
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleValueCommit = (value: number[]) => {
    const seekTime = value[0];
    if (isDragging && isEngineInitialized && seekTime !== undefined) {
      seek(seekTime);
    }
    setIsDragging(false);
  };

  const isDisabled = !isEngineInitialized ||
    !Number.isFinite(duration) ||
    duration <= 0 ||
    playbackState === PlaybackState.IDLE ||
    playbackState === PlaybackState.LOADING ||
    playbackState === PlaybackState.ERROR ||
    error !== null;

  const displayTime = Number.isFinite(internalTime) ? (isDragging ? internalTime : currentTime) : 0;
  const maxDuration = Number.isFinite(duration) && duration > 0 ? duration : 1;
  const displayDuration = Number.isFinite(duration) ? duration : 0;

  const formattedCurrentTime = formatDuration(displayTime);
  const formattedRemainingTime = formatDuration(Math.max(0, displayDuration - displayTime));

  const isoCurrentTime = formatSecondsToISO8601(displayTime);
  const isoRemainingTime = formatSecondsToISO8601(Math.max(0, displayDuration - displayTime));

  return (
    <div className={cn("w-full", className)} data-state={isDisabled ? "disabled" : "enabled"}>
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
        <time dateTime={isoCurrentTime}>{formattedCurrentTime}</time>
        <time dateTime={isoRemainingTime}>-{formattedRemainingTime}</time>
      </div>
      <Slider
        value={[displayTime]}
        max={maxDuration}
        step={0.1}
        disabled={isDisabled}
        onValueChange={handleValueChange}
        onPointerDown={handlePointerDown}
        onValueCommit={handleValueCommit}
        aria-label="Audio Seek Bar"
        {...props}
      />
    </div>
  );
}
