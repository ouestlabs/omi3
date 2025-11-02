"use client";

import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/registry/default/ui/frame";
import { PlayerTrackInfo } from "@/registry/default/ui/player";

function PlayerTrackInfoParticle() {
  return (
    <Frame>
      <FrameHeader>
        <FrameTitle>Player Track Info</FrameTitle>
      </FrameHeader>
      <FramePanel>
        <PlayerTrackInfo />
      </FramePanel>
    </Frame>
  );
}

export default PlayerTrackInfoParticle;
