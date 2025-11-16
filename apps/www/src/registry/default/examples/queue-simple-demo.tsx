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
import {
  AudioQueue,
  AudioQueuePreferences,
} from "@/registry/default/ui/audio/queue";

export default function AudioQueueSimpleDemo() {
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
          <AudioControlGroup>
            <AudioVolume />
            <AudioQueuePreferences />
            <AudioQueue />
          </AudioControlGroup>
        </AudioControlGroup>
      </AudioControlBar>
    </AudioPlayer>
  );
}
