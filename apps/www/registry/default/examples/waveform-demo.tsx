"use client";

import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/registry/default/ui/frame";
import { ScrollingWaveform } from "@/registry/default/ui/waveform";
export default function WaveformDemo() {
  return (
    <Frame className="w-full">
      <FrameHeader className="mb-4">
        <FrameTitle>Waveform</FrameTitle>
        <FrameDescription>
          Real-time audio visualization with smooth scrolling animation
        </FrameDescription>
      </FrameHeader>
      <FramePanel>
        <ScrollingWaveform
          barColor="gray"
          barGap={2}
          barWidth={3}
          height={80}
          speed={30}
        />
      </FramePanel>
    </Frame>
  );
}
