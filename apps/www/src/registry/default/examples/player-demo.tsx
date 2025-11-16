import {
  AudioControlBar,
  AudioPlay,
  AudioPlayer,
  AudioSeekBar,
  AudioTimeDisplay,
  AudioVolume,
} from "@/registry/default/ui/audio/player";

export default function AudioDemoPlayer() {
  return (
    <AudioPlayer>
      <AudioControlBar>
        <AudioPlay />
        <AudioSeekBar />
        <AudioTimeDisplay />
        <AudioVolume />
      </AudioControlBar>
    </AudioPlayer>
  );
}
