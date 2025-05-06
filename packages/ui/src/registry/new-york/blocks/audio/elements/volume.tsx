"use client";

import {
  useAudio,
} from "@omi3/audio/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Volume, Volume1, Volume2, VolumeX } from "lucide-react";
import { useCallback } from "react";

type AudioVolumeProps = React.ComponentProps<typeof DropdownMenu> & {
  className?: string;
  triggerClassName?: string;
  sliderProps?: React.ComponentProps<typeof Slider>;
};

export function AudioVolume({
  className,
  triggerClassName,
  sliderProps,
  ...props
}: AudioVolumeProps) {
  const {
    volume,
    isMuted,
    isEngineInitialized,
    setVolume,
  } = useAudio();

  const handleVolumeChange = useCallback((value: number[]) => {
    const newVolume = value[0];
    if (isEngineInitialized && newVolume !== undefined) {
      setVolume(newVolume);
    }
  }, [isEngineInitialized, setVolume]);

  const getVolumeIcon = useCallback(() => {
    if (!isEngineInitialized || isMuted || volume === 0) {
      return <VolumeX className="h-5 w-5" aria-hidden="true" />;
    }
    if (volume < 0.33) {
      return <Volume className="h-5 w-5" aria-hidden="true" />;
    }
    if (volume < 0.77) {
      return <Volume1 className="h-5 w-5" aria-hidden="true" />;
    }
    return <Volume2 className="h-5 w-5" aria-hidden="true" />;
  }, [isEngineInitialized, isMuted, volume]);

  const volumePercentage = Math.round((isMuted ? 0 : volume) * 100);
  const currentVolume = isMuted ? 0 : volume;
  const isDisabled = !isEngineInitialized;
  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("hidden md:flex", triggerClassName)}
          disabled={isDisabled}
          aria-label={`Volume Control: ${volumePercentage}%${isMuted ? ' (Muted)' : ''}`}
          data-state={isMuted ? "muted" : volume === 0 ? "zero" : "active"}
        >
          {getVolumeIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        align="center"
        className={cn("w-48 p-3", className)}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Volume</span>
            <span className="text-sm font-medium tabular-nums">{volumePercentage}%</span>
          </div>
          <Slider
            value={[currentVolume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            disabled={isDisabled}
            className={cn("w-full", sliderProps?.className)}
            aria-label="Volume Control Slider"
            {...sliderProps}
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
