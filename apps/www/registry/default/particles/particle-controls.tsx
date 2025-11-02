"use client";

import { memo } from "react";
import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/registry/default/ui/frame";
import {
  NextButton,
  PlayerSpeed,
  PlayPauseButton,
  PreviousButton,
  SkipBackwardButton,
  SkipForwardButton,
} from "@/registry/default/ui/player";

const PlayerControlsParticle = memo(function _PlayerControlsParticle() {
  return (
    <Frame>
      <FrameHeader>
        <FrameTitle>Player Controls</FrameTitle>
      </FrameHeader>
      <FramePanel>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center justify-center gap-2">
            <PreviousButton />
            <SkipBackwardButton />
            <PlayPauseButton />
            <SkipForwardButton />
            <NextButton />
          </div>
          <div className="flex items-center justify-center gap-2">
            <PlayerSpeed />
          </div>
        </div>
      </FramePanel>
    </Frame>
  );
});

export default PlayerControlsParticle;
