"use client";

import { useAudioState } from "@omi3/audio/react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { MusicIcon } from "lucide-react";

type AudioTrackArtworkProps = React.ComponentProps<"div"> & {
  iconClassName?: string;
};

function AudioTrackArtwork({ className, iconClassName, ...props }: AudioTrackArtworkProps) {
  return (
    <div
      className={cn(
        "h-10 w-10 flex-shrink-0 flex items-center justify-center bg-muted rounded-sm",
        className
      )}
      {...props}
    >
      <MusicIcon className={cn("h-5 w-5 text-muted-foreground", iconClassName)} />
    </div>
  );
}

type AudioTrackInfoProps = React.ComponentProps<"div">;

export function AudioTrackInfo({ className, ...props }: AudioTrackInfoProps) {
  const { isLoading, error, currentMusic } = useAudioState();

  if (isLoading) {
    return (
      <div
        className={cn("flex items-center space-x-2 w-full truncate", className)}
        {...props}
        data-state="loading"
        aria-live="polite"
        aria-busy="true"
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
        className={cn("flex items-center space-x-2 w-full truncate text-destructive", className)}
        {...props}
        data-state="error"
        role="alert"
      >
        <AudioTrackArtwork />
        <div className="space-y-1">
          <p className="text-sm font-medium">Error loading track</p>
          <p className="text-xs">{error.message || "An unknown error occurred."}</p>
        </div>
      </div>
    );
  }

  if (!currentMusic) {
    return (
      <div
        className={cn("flex items-center space-x-2 w-full truncate", className)}
        {...props}
        data-state="empty"
      >
        <AudioTrackArtwork />
        <div className="space-y-1">
          <p className="text-sm font-medium">No track selected</p>
          <p className="text-xs text-muted-foreground">Please select a track</p>
        </div>
      </div>
    );
  }

  const itemScope = true;
  const itemType = "https://schema.org/MusicRecording";

  return (
    <div
      className={cn("flex items-center space-x-2 w-full truncate", className)}
      itemScope={itemScope}
      itemType={itemType}
      {...props}
      data-state="loaded"
    >
      {currentMusic.artwork ? (
        <figure className="size-10 flex-shrink-0 aspect-square rounded-sm overflow-hidden" itemProp="image">
          <img
            src={currentMusic.artwork.src}
            alt={`Artwork for ${currentMusic.title || 'track'}`}
            className="size-full object-cover"
          />
        </figure>
      ) : (
        <AudioTrackArtwork />
      )}
      <dl className="space-y-1 overflow-hidden">
        <div>
          <dt className="sr-only">Title</dt>
          <dd className="text-sm font-medium truncate" itemProp="name">
            {currentMusic.title || "Unknown Title"}
          </dd>
        </div>
        <div>
          <dt className="sr-only">Artist</dt>
          <dd className="text-xs text-muted-foreground truncate" itemProp="byArtist">
            {currentMusic.artist || "Unknown Artist"}
          </dd>
        </div>
      </dl>
    </div>
  );
}
