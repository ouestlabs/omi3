"use client";

import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/registry/default/ui/frame";
import {
  PlayerDuration,
  PlayerProgress,
  PlayerTime,
} from "@/registry/default/ui/player";

function PlayerSeekBar() {
  return (
    <Frame>
      <FrameHeader>
        <FrameTitle>Player Seek Bar</FrameTitle>
      </FrameHeader>
      <FramePanel>
        <div className="flex w-full items-center justify-center gap-2">
          <PlayerTime className="text-xs" />
          <PlayerProgress className="flex-1" />
          <PlayerDuration className="text-xs" />
        </div>
      </FramePanel>
    </Frame>
  );
}

export default PlayerSeekBar;
