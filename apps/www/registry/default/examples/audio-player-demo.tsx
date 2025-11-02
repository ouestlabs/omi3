"use client";

import { type QueueItem, useAudio } from "audio-engine/react";
import { PauseIcon, PlayIcon } from "lucide-react";
import { cn } from "@/registry/default/lib/utils";
import { Button } from "@/registry/default/ui/button";
import { Frame, FramePanel } from "@/registry/default/ui/frame";
import {
  exampleTracks,
  Player,
  PlayerDuration,
  PlayerProgress,
  PlayerSpeed,
  PlayerTime,
  PlayPauseButton,
} from "@/registry/default/ui/player";
import { ScrollArea } from "@/registry/default/ui/scroll-area";

export default function AudioPlayer() {
  return (
    <Player>
      <AudioPlayerDemo />
    </Player>
  );
}

const AudioPlayerDemo = () => (
  <Frame className="w-full overflow-hidden">
    <FramePanel className="flex flex-col lg:h-[180px] lg:flex-row">
      <div className="flex flex-col overflow-hidden bg-muted/50 lg:h-full lg:w-64">
        <ScrollArea className="h-48 w-full lg:h-full">
          <div className="space-y-1 p-3">
            {exampleTracks.map((song, index) => (
              <SongListItem key={song.id} song={song} trackNumber={index + 1} />
            ))}
          </div>
        </ScrollArea>
      </div>
      <PlayerControls />
    </FramePanel>
  </Frame>
);

const PlayerControls = () => {
  const audio = useAudio();
  const queue = audio.state.queue.items;
  const activeItemId = audio.state.queue.activeItemId;

  // Trouver l'item actif dans la queue
  const activeItem = queue?.find((item) => item.id === activeItemId);
  const trackTitle = activeItem?.title || "No track selected";

  return (
    <div className="flex flex-1 items-center p-4 sm:p-6">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-4">
          <h3 className="font-semibold text-base sm:text-lg">{trackTitle}</h3>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <PlayPauseButton
            className="h-12 w-12 shrink-0 sm:h-10 sm:w-10"
            disabled={!activeItem}
            size="default"
            variant="outline"
          />
          <div className="flex flex-1 items-center gap-2 sm:gap-3">
            <PlayerTime className="text-xs tabular-nums" />
            <PlayerProgress className="flex-1" />
            <PlayerDuration className="text-xs tabular-nums" />
            <PlayerSpeed size="icon" variant="ghost" />
          </div>
        </div>
      </div>
    </div>
  );
};

const SongListItem = ({
  song,
  trackNumber,
}: {
  song: QueueItem<{ name: string }>;
  trackNumber: number;
}) => {
  const audio = useAudio();
  const activeItemId = audio.state.queue.activeItemId;
  const isPlaying = audio.state.playback.isPlaying;
  const play = audio.actions.playback.play;
  const pause = audio.actions.playback.pause;
  const isActive = activeItemId === song.id;
  const isCurrentlyPlaying = isActive && isPlaying;

  return (
    <div className="group/song relative">
      <Button
        className={cn(
          "h-10 w-full justify-start px-3 font-normal sm:h-9 sm:px-2",
          isActive && "bg-secondary"
        )}
        onClick={() => {
          if (isCurrentlyPlaying) {
            pause();
          } else {
            play(song);
          }
        }}
        size="sm"
        variant={isActive ? "secondary" : "ghost"}
      >
        <div className="flex w-full items-center gap-3">
          <div className="flex w-5 shrink-0 items-center justify-center">
            {isCurrentlyPlaying ? (
              <PauseIcon className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
            ) : (
              <>
                <span className="text-muted-foreground/60 text-sm tabular-nums group-hover/song:invisible">
                  {trackNumber}
                </span>
                <PlayIcon className="invisible absolute h-4 w-4 group-hover/song:visible sm:h-3.5 sm:w-3.5" />
              </>
            )}
          </div>
          <span className="truncate text-left text-sm">{song.title}</span>
        </div>
      </Button>
    </div>
  );
};
