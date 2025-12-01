"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { MusicIcon, RadioIcon } from "lucide-react";
import React from "react";
import { isLive } from "@/registry/default/lib/audio";
import { useAudioStore } from "@/registry/default/lib/audio-store";
import { cn } from "@/registry/default/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/ui/avatar";
import { Badge } from "@/registry/default/ui/badge";
import {
  AudioPlayerPlay,
  AudioPlayerSeekBar,
  AudioPlayerSkipBack,
  AudioPlayerSkipForward,
  AudioPlayerTimeDisplay,
  AudioPlayerVolume,
} from "@/registry/default/ui/audio/player";

const audioNowPlayingVariants = cva(
  "flex w-full items-center gap-3 rounded-lg border bg-card p-3",
  {
    variants: {
      variant: {
        default: "",
        compact: "p-2",
        minimal: "border-none bg-transparent p-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type AudioNowPlayingProps = React.ComponentProps<"div"> &
  VariantProps<typeof audioNowPlayingVariants> & {
    showArtwork?: boolean;
    showControls?: boolean;
    showSeekBar?: boolean;
    showTime?: boolean;
    showVolume?: boolean;
  };

function AudioNowPlaying({
  className,
  variant = "default",
  showArtwork = true,
  showControls = true,
  showSeekBar = true,
  showTime = true,
  showVolume = true,
  ...props
}: AudioNowPlayingProps) {
  const currentTrack = useAudioStore((state) => state.currentTrack);
  const isLiveStream = currentTrack ? isLive(currentTrack) : false;

  if (!currentTrack) {
    return (
      <div
        className={cn(
          audioNowPlayingVariants({ variant }),
          "items-center justify-center text-muted-foreground",
          className
        )}
        {...props}
      >
        <MusicIcon className="size-5" />
        <span className="text-sm">No track playing</span>
      </div>
    );
  }

  const artwork = currentTrack.artwork || currentTrack.images?.[0];

  return (
    <div
      className={cn(audioNowPlayingVariants({ variant }), className)}
      data-slot="audio-now-playing"
      {...props}
    >
      {showArtwork && (
        <div className="shrink-0">
          {artwork ? (
            <Avatar className="size-12 rounded-md">
              <AvatarImage
                alt={currentTrack.title || "Track artwork"}
                className="object-cover"
                src={artwork}
              />
              <AvatarFallback className="rounded-md">
                <MusicIcon className="size-5 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="flex size-12 items-center justify-center rounded-md bg-muted">
              <MusicIcon className="size-5 text-muted-foreground" />
            </div>
          )}
        </div>
      )}

      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-center gap-2">
          <h3
            className="truncate font-medium text-sm"
            title={currentTrack.title}
          >
            {currentTrack.title || "Unknown Track"}
          </h3>
          {isLiveStream && (
            <Badge className="bg-destructive/10 px-1 py-0.5 font-medium text-[10px] text-destructive uppercase leading-none">
              <RadioIcon className="size-2.5" />
              Live
            </Badge>
          )}
        </div>
        {currentTrack.artist && (
          <p className="truncate text-xs text-muted-foreground">
            {currentTrack.artist}
          </p>
        )}

        {showSeekBar && (
          <div className="flex items-center gap-2">
            {showTime && (
              <AudioPlayerTimeDisplay className="min-w-10 text-xs" />
            )}
            <AudioPlayerSeekBar className="flex-1" />
            {showTime && (
              <AudioPlayerTimeDisplay
                className="min-w-10 text-right text-xs"
                remaining
              />
            )}
          </div>
        )}
      </div>

      {showControls && (
        <div className="flex shrink-0 items-center gap-1">
          <AudioPlayerSkipBack size="icon-sm" variant="ghost" />
          <AudioPlayerPlay size="icon-sm" variant="ghost" />
          <AudioPlayerSkipForward size="icon-sm" variant="ghost" />
          {showVolume && (
            <div className="ml-1">
              <AudioPlayerVolume size="icon-sm" variant="ghost" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { AudioNowPlaying };
