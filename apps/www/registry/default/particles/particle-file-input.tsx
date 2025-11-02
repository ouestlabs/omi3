"use client";

import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/registry/default/ui/frame";
import { PlayerFileInput } from "@/registry/default/ui/player";

function PlayerFileInputParticle() {
  return (
    <Frame>
      <FrameHeader>
        <FrameTitle>Player File Input</FrameTitle>
      </FrameHeader>
      <FramePanel>
        <PlayerFileInput />
      </FramePanel>
    </Frame>
  );
}

export default PlayerFileInputParticle;
