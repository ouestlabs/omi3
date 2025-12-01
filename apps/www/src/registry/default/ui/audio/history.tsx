"use client";

import { HistoryIcon } from "lucide-react";
import React from "react";
import type { Track } from "@/registry/default/lib/audio";
import { useAudioStore } from "@/registry/default/lib/audio-store";
import { cn } from "@/registry/default/lib/utils";
import { AudioTrackList } from "@/registry/default/ui/audio/track";
import { Button } from "@/registry/default/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/default/ui/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/default/ui/empty";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/default/ui/tooltip";

export type AudioHistoryProps = {
  onTrackSelect?: (index: number, track?: Track) => void;
  maxItems?: number;
  emptyLabel?: string;
  emptyDescription?: string;
};

function AudioHistory({
  onTrackSelect,
  maxItems,
  emptyLabel = "No history",
  emptyDescription = "Tracks you've played will appear here",
}: AudioHistoryProps) {
  const history = useAudioStore((state) => state.history);
  const setQueueAndPlay = useAudioStore((state) => state.setQueueAndPlay);
  const togglePlay = useAudioStore((state) => state.togglePlay);
  const currentTrackId = useAudioStore((state) => state.currentTrack?.id);

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const displayHistory = maxItems ? history.slice(0, maxItems) : history;
  const reversedHistory = [...displayHistory].reverse();

  const handleTrackSelect = React.useCallback(
    (index: number, track?: Track) => {
      if (!track) {
        return;
      }

      const historyIndex = reversedHistory.length - 1 - index;
      const actualTrack = reversedHistory[historyIndex];

      if (!actualTrack) {
        return;
      }

      if (currentTrackId === actualTrack.id) {
        togglePlay();
      } else {
        setQueueAndPlay([actualTrack], 0);
      }

      onTrackSelect?.(historyIndex, actualTrack);
      setDialogOpen(false);
    },
    [reversedHistory, currentTrackId, togglePlay, setQueueAndPlay, onTrackSelect]
  );

  const historyCount = history.length;

  return (
    <Dialog
      onOpenChange={setDialogOpen}
      open={dialogOpen}
    >
      <DialogTrigger asChild>
        <Button
          size="icon"
          tooltip
          tooltipLabel={`History (${historyCount})`}
          variant="outline"
        >
          <HistoryIcon />
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-label="Playback history"
        className="max-h-[80vh] rounded-xl"
        data-slot="audio-history"
      >
        <DialogHeader>
          <DialogTitle>Playback History</DialogTitle>
          <DialogDescription>
            {historyCount === 0
              ? emptyDescription
              : `${historyCount} track${historyCount !== 1 ? "s" : ""} played`}
          </DialogDescription>
        </DialogHeader>
        {reversedHistory.length === 0 ? (
          <Empty className="border-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <HistoryIcon />
              </EmptyMedia>
              <EmptyTitle>{emptyLabel}</EmptyTitle>
              <EmptyDescription className="text-xs/relaxed">
                {emptyDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <AudioTrackList
            emptyDescription={emptyDescription}
            emptyLabel={emptyLabel}
            onTrackSelect={handleTrackSelect}
            tracks={reversedHistory}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export { AudioHistory };
