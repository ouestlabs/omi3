"use client";

import {
  VolumeHighIcon,
  VolumeLow1Icon,
  VolumeLowIcon,
  VolumeMutedIcon,
} from "@audio-ui/icons";
import { useAudio } from "audio-engine/react";
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/registry/default/ui/button";
import { Menu, MenuPopup, MenuTrigger } from "@/registry/default/ui/menu";
import { Slider } from "@/registry/default/ui/slider";

interface AudioVolumeProps
  extends Omit<React.ComponentProps<typeof Menu>, "children"> {
  className?: string;
  triggerClassName?: string;
  sliderProps?: React.ComponentProps<typeof Slider>;
}

const VOLUME_THRESHOLD_LOW = 0.33;
const VOLUME_THRESHOLD_LOW_1 = 0.77;
const VOLUME_PERCENTAGE_MAX = 100;

function AudioVolume({
  className,
  triggerClassName,
  sliderProps,
  ...props
}: AudioVolumeProps) {
  const { volume, isMuted, isEngineInitialized, setVolume } = useAudio();

  const handleVolumeChange = useCallback(
    (value: number | readonly number[]) => {
      const newValue = Array.isArray(value) ? value[0] : value;
      if (isEngineInitialized && newValue !== undefined) {
        setVolume(newValue);
      }
    },
    [isEngineInitialized, setVolume]
  );

  const getVolumeIcon = useCallback(() => {
    if (!isEngineInitialized || isMuted || volume === 0) {
      return <VolumeMutedIcon />;
    }
    if (volume < VOLUME_THRESHOLD_LOW) {
      return <VolumeLowIcon />;
    }
    if (volume < VOLUME_THRESHOLD_LOW_1) {
      return <VolumeLow1Icon />;
    }
    return <VolumeHighIcon />;
  }, [isEngineInitialized, isMuted, volume]);

  const volumePercentage = Math.round(
    (isMuted ? 0 : volume) * VOLUME_PERCENTAGE_MAX
  );
  const currentVolume = isMuted ? 0 : volume;
  const isDisabled = !isEngineInitialized;

  const getDataState = () => {
    if (isMuted) {
      return "muted";
    }
    if (volume === 0) {
      return "zero";
    }
    return "active";
  };

  return (
    <Menu {...props}>
      <MenuTrigger
        render={
          <Button
            aria-label={`Volume Control: ${volumePercentage}%${isMuted ? " (Muted)" : ""}`}
            className={cn("hidden md:flex", triggerClassName)}
            data-state={getDataState()}
            disabled={isDisabled}
            size="icon"
            variant="ghost"
          />
        }
      >
        {getVolumeIcon()}
      </MenuTrigger>
      <MenuPopup align="center" className={cn("w-48 space-y-2 p-3", className)}>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Volume</span>
          <span className="font-medium text-sm tabular-nums">
            {volumePercentage}%
          </span>
        </div>
        <Slider
          aria-label="Volume Control Slider"
          className={cn("w-full", sliderProps?.className)}
          disabled={isDisabled}
          max={1}
          onValueChange={handleVolumeChange}
          step={0.01}
          value={[currentVolume]}
          {...sliderProps}
        />
      </MenuPopup>
    </Menu>
  );
}

export default AudioVolume;
