"use client";

import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/registry/default/ui/frame";
import { PlayerVolume } from "@/registry/default/ui/player";

function PlayerVolumeParticle() {
  return (
    <Frame>
      <FrameHeader>
        <FrameTitle>Player Volume</FrameTitle>
      </FrameHeader>
      <FramePanel>
        <PlayerVolume />
      </FramePanel>
    </Frame>
  );
}

export default PlayerVolumeParticle;
