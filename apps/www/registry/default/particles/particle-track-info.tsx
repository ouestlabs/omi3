"use client";

import { MusicIcon } from "@audio-ui/icons";
import { useAudioState } from "audio-engine/react";
import { cn } from "@/lib/utils";
import { Cover, CoverFallback, CoverImage } from "@/registry/default/ui/cover";
import { Skeleton } from "@/registry/default/ui/skeleton";

type AudioTrackArtworkProps = React.ComponentProps<"div"> & {
  iconClassName?: string;
};

function AudioTrackArtwork({
  className,
  iconClassName,
  ...props
}: AudioTrackArtworkProps) {
  return (
    <div
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-muted",
        className
      )}
      {...props}
    >
      <MusicIcon
        className={cn("h-5 w-5 text-muted-foreground", iconClassName)}
      />
    </div>
  );
}

type AudioTrackInfoProps = React.ComponentProps<"div">;

function AudioTrackInfo({ className, ...props }: AudioTrackInfoProps) {
  const { isLoading, error, currentMusic } = useAudioState();

  if (isLoading) {
    return (
      <div
        className={cn("flex w-full items-center space-x-2 truncate", className)}
        {...props}
        aria-busy="true"
        aria-live="polite"
        data-state="loading"
      >
        <AudioTrackArtwork />
        <div className="space-y-1">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-3 w-[100px]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "flex w-full items-center space-x-2 truncate text-destructive",
          className
        )}
        {...props}
        data-state="error"
        role="alert"
      >
        <AudioTrackArtwork />
        <div className="space-y-1">
          <p className="font-medium text-sm">Error loading track</p>
          <p className="text-xs">
            {error.message || "An unknown error occurred."}
          </p>
        </div>
      </div>
    );
  }

  if (!currentMusic) {
    return (
      <div
        className={cn("flex w-full items-center space-x-2 truncate", className)}
        {...props}
        data-state="empty"
      >
        <AudioTrackArtwork />
        <div className="space-y-1">
          <p className="font-medium text-sm">No track selected</p>
          <p className="text-muted-foreground text-xs">Please select a track</p>
        </div>
      </div>
    );
  }

  const itemScope = true;
  const itemType = "https://schema.org/MusicRecording";

  return (
    <div
      className={cn("flex w-full items-center space-x-2 truncate", className)}
      itemScope={itemScope}
      itemType={itemType}
      {...props}
      data-state="loaded"
    >
      <Cover className="size-10 shrink-0 rounded-sm" itemProp="image">
        {currentMusic.artwork && (
          <CoverImage
            alt={`Artwork for ${currentMusic.title || "track"}`}
            className="object-cover"
            src={currentMusic.artwork.src}
          />
        )}
        <CoverFallback className="rounded-sm">
          <MusicIcon className="h-5 w-5 text-muted-foreground" />
        </CoverFallback>
      </Cover>
      <dl className="space-y-1 overflow-hidden">
        <div>
          <dt className="sr-only">Title</dt>
          <dd className="truncate font-medium text-sm" itemProp="name">
            {currentMusic.title || "Unknown Title"}
          </dd>
        </div>
        <div>
          <dt className="sr-only">Artist</dt>
          <dd
            className="truncate text-muted-foreground text-xs"
            itemProp="byArtist"
          >
            {currentMusic.artist || "Unknown Artist"}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export default AudioTrackInfo;
