import {
  AudioPlayer,
  AudioPlayerControlBar,
  AudioPlayerControlGroup,
  AudioPlayerPlay,
  AudioPlayerSeekBar,
  AudioPlayerSkipBack,
  AudioPlayerSkipForward,
  AudioPlayerTimeDisplay,
  AudioPlayerVolume,
} from "@/registry/default/ui/audio/player";
import {
  AudioQueue,
  AudioQueuePreferences,
} from "@/registry/default/ui/audio/queue";

export default function AudioQueueSimpleDemo() {
  return (
    <AudioPlayer>
      <AudioPlayerControlBar variant="stacked">
        <AudioPlayerControlGroup>
          <AudioPlayerTimeDisplay />
          <AudioPlayerSeekBar />
          <AudioPlayerTimeDisplay remaining />
        </AudioPlayerControlGroup>
        <AudioPlayerControlGroup className="justify-between">
          <AudioPlayerControlGroup>
            <AudioPlayerSkipBack />
            <AudioPlayerPlay />
            <AudioPlayerSkipForward />
          </AudioPlayerControlGroup>
          <AudioPlayerControlGroup>
            <AudioPlayerVolume />
            <AudioQueuePreferences />
            <AudioQueue />
          </AudioPlayerControlGroup>
        </AudioPlayerControlGroup>
      </AudioPlayerControlBar>
    </AudioPlayer>
  );
}
