import {
  AudioPlayer,
  AudioPlayerControlBar,
} from "@/registry/default/ui/audio/player";
import {
  AudioQueue,
  AudioQueuePreferences,
} from "@/registry/default/ui/audio/queue";

export default function AudioQueuePreferencesDemo() {
  return (
    <AudioPlayer className="w-max">
      <AudioPlayerControlBar>
        <AudioQueuePreferences />
        <AudioQueue />
      </AudioPlayerControlBar>
    </AudioPlayer>
  );
}
