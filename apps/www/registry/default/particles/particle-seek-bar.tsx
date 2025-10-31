"use client";

import { formatDuration, formatSecondsToISO8601 } from "@audio-ui/utils";
import { PlaybackState, useAudio, useAudioTime } from "audio-engine/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/registry/default/ui/slider";

type AudioSeekBarProps = React.ComponentProps<typeof Slider> & {
  className?: string;
};

function AudioSeekBar({ className, ...props }: AudioSeekBarProps) {
  const { currentTime, duration } = useAudioTime();
  const { playbackState, error, isEngineInitialized, seek } = useAudio();

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

  const handleValueChange = (value: number | readonly number[]) => {
    const newTime = Array.isArray(value) ? value[0] : value;
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

  const isDisabled =
    !(isEngineInitialized && Number.isFinite(duration)) ||
    duration <= 0 ||
    playbackState === PlaybackState.IDLE ||
    playbackState === PlaybackState.LOADING ||
    playbackState === PlaybackState.ERROR ||
    error !== null;

  let displayTime = 0;
  if (Number.isFinite(internalTime)) {
    displayTime = isDragging ? internalTime : currentTime;
  }
  const maxDuration = Number.isFinite(duration) && duration > 0 ? duration : 1;
  const displayDuration = Number.isFinite(duration) ? duration : 0;

  const formattedCurrentTime = formatDuration(displayTime);
  const formattedRemainingTime = formatDuration(
    Math.max(0, displayDuration - displayTime)
  );

  const isoCurrentTime = formatSecondsToISO8601(displayTime);
  const isoRemainingTime = formatSecondsToISO8601(
    Math.max(0, displayDuration - displayTime)
  );

  return (
    <div
      className={cn("w-full", className)}
      data-state={isDisabled ? "disabled" : "enabled"}
    >
      <div className="mb-1.5 flex items-center justify-between text-muted-foreground text-xs">
        <time dateTime={isoCurrentTime}>{formattedCurrentTime}</time>
        <time dateTime={isoRemainingTime}>-{formattedRemainingTime}</time>
      </div>
      <Slider
        aria-label="Audio Seek Bar"
        disabled={isDisabled}
        max={maxDuration}
        onPointerDown={handlePointerDown}
        onValueChange={handleValueChange}
        onValueCommitted={(value) => {
          const seekTime = Array.isArray(value) ? value[0] : value;
          if (isDragging && isEngineInitialized && seekTime !== undefined) {
            seek(seekTime);
          }
          setIsDragging(false);
        }}
        step={0.1}
        value={[displayTime]}
        {...props}
      />
    </div>
  );
}

export default AudioSeekBar;
