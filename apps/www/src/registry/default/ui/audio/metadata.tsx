"use client";

import { InfoIcon } from "lucide-react";
import React from "react";
import { isLive, type Track } from "@/registry/default/lib/audio";
import { useAudioStore } from "@/registry/default/lib/audio-store";
import { cn } from "@/registry/default/lib/utils";
import { $audio } from "@/registry/default/lib/audio";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/default/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/default/ui/table";
import { Badge } from "@/registry/default/ui/badge";
import { Button } from "@/registry/default/ui/button";

export type AudioMetadataProps = {
  track?: Track;
  showButton?: boolean;
  buttonLabel?: string;
  className?: string;
};

function formatFileSize(bytes?: number): string {
  if (!bytes || bytes === 0) {
    return "Unknown";
  }
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round(bytes / Math.pow(k, i) * 100) / 100} ${sizes[i]}`;
}

function getFileExtension(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const match = pathname.match(/\.([^.]+)$/);
    return match ? match[1].toUpperCase() : "Unknown";
  } catch {
    const match = url.match(/\.([^.]+)(?:\?|$)/);
    return match ? match[1].toUpperCase() : "Unknown";
  }
}

function AudioMetadata({
  track: externalTrack,
  showButton = true,
  buttonLabel = "Metadata",
  className,
}: AudioMetadataProps) {
  const currentTrack = useAudioStore((state) => state.currentTrack);
  const duration = useAudioStore((state) => state.duration);
  const playbackRate = useAudioStore((state) => state.playbackRate);
  const volume = useAudioStore((state) => state.volume);
  const isMuted = useAudioStore((state) => state.isMuted);

  const track = externalTrack || currentTrack;
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [audioMetadata, setAudioMetadata] = React.useState<{
    readyState?: number;
    networkState?: number;
    buffered?: number;
  } | null>(null);

  React.useEffect(() => {
    if (!dialogOpen || !track) {
      return;
    }

    const updateMetadata = () => {
      const audio = $audio.getAudioElement();
      if (!audio) {
        return;
      }

      const buffered = audio.buffered;
      let bufferedEnd = 0;
      if (buffered.length > 0) {
        bufferedEnd = buffered.end(buffered.length - 1);
      }

      setAudioMetadata({
        readyState: audio.readyState,
        networkState: audio.networkState,
        buffered: bufferedEnd,
      });
    };

    updateMetadata();
    const interval = setInterval(updateMetadata, 500);

    return () => clearInterval(interval);
  }, [dialogOpen, track]);

  if (!track) {
    return null;
  }

  const isLiveStream = isLive(track);
  const fileExtension = getFileExtension(track.url);
  const readyStateLabels: Record<number, string> = {
    0: "No information",
    1: "Metadata loaded",
    2: "Current data loaded",
    3: "Future data loaded",
    4: "Enough data loaded",
  };

  const networkStateLabels: Record<number, string> = {
    0: "Empty",
    1: "Idle",
    2: "Loading",
    3: "No source",
  };

  const metadataRows = [
    { label: "Title", value: track.title || "Unknown" },
    { label: "Artist", value: track.artist || "Unknown" },
    { label: "Album", value: track.album || "Unknown" },
    { label: "Genre", value: track.genre || "Unknown" },
    { label: "Duration", value: duration > 0 ? `${Math.round(duration)}s` : "Unknown" },
    { label: "Format", value: fileExtension },
    { label: "URL", value: track.url, isUrl: true },
    { label: "Playback Rate", value: `${playbackRate}x` },
    { label: "Volume", value: `${Math.round(volume * 100)}% ${isMuted ? "(Muted)" : ""}` },
    { label: "Ready State", value: audioMetadata?.readyState !== undefined ? readyStateLabels[audioMetadata.readyState] || "Unknown" : "Unknown" },
    { label: "Network State", value: audioMetadata?.networkState !== undefined ? networkStateLabels[audioMetadata.networkState] || "Unknown" : "Unknown" },
    { label: "Buffered", value: audioMetadata?.buffered ? `${Math.round(audioMetadata.buffered)}s` : "Unknown" },
  ];

  const content = (
    <DialogContent
      className="max-h-[80vh] max-w-2xl"
      data-slot="audio-metadata"
    >
      <DialogHeader>
        <DialogTitle>Track Metadata</DialogTitle>
        <DialogDescription>
          Technical information about the current track
        </DialogDescription>
      </DialogHeader>
      <div className="max-h-[60vh] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metadataRows.map((row) => (
              <TableRow key={row.label}>
                <TableCell className="font-medium text-muted-foreground">
                  {row.label}
                </TableCell>
                <TableCell>
                  {row.isUrl ? (
                    <a
                      className="break-all text-primary underline hover:no-underline"
                      href={row.value}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {row.value}
                    </a>
                  ) : (
                    <span className="break-words">{row.value}</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {isLiveStream && (
              <TableRow>
                <TableCell className="font-medium text-muted-foreground">
                  Stream Type
                </TableCell>
                <TableCell>
                  <Badge className="bg-destructive/10 text-destructive">
                    Live Stream
                  </Badge>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </DialogContent>
  );

  if (!showButton) {
    return (
      <Dialog
        onOpenChange={setDialogOpen}
        open={dialogOpen}
      >
        {content}
      </Dialog>
    );
  }

  return (
    <Dialog
      onOpenChange={setDialogOpen}
      open={dialogOpen}
    >
      <DialogTrigger asChild>
        <Button
          className={cn(className)}
          data-slot="audio-metadata-button"
          size="icon"
          variant="outline"
        >
          <InfoIcon className="size-4" />
        </Button>
      </DialogTrigger>
      {content}
    </Dialog>
  );
}

export { AudioMetadata };
