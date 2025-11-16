import {
  AudioControlBar,
  AudioControlGroup,
  AudioPlay,
  AudioPlayer,
  AudioSeekBar,
  AudioSkipBack,
  AudioSkipForward,
  AudioTimeDisplay,
  AudioVolume,
} from "@/registry/default/ui/audio/player";

export default function AudioPlayerStackedDemo() {
  return (
    <AudioPlayer>
      <AudioControlBar variant="stacked">
        <AudioControlGroup>
          <AudioTimeDisplay />
          <AudioSeekBar />
          <AudioTimeDisplay remaining />
        </AudioControlGroup>
        <AudioControlGroup className="justify-between">
          <AudioControlGroup>
            <AudioSkipBack />
            <AudioPlay />
            <AudioSkipForward />
          </AudioControlGroup>
          <AudioVolume />
        </AudioControlGroup>
      </AudioControlBar>
    </AudioPlayer>
  );
}
