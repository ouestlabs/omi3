import {
  AudioPlayer,
  AudioPlayerControlBar,
  AudioPlayerPlay,
  AudioPlayerSeekBar,
  AudioPlayerTimeDisplay,
  AudioPlayerVolume,
} from "@/registry/default/ui/audio/player";

export default function AudioDemoPlayer() {
  return (
    <AudioPlayer>
      <AudioPlayerControlBar>
        <AudioPlayerPlay />
        <AudioPlayerSeekBar />
        <AudioPlayerTimeDisplay />
        <AudioPlayerVolume />
      </AudioPlayerControlBar>
    </AudioPlayer>
  );
}
