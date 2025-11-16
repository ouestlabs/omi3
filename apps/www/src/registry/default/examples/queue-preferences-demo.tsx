import {
  AudioControlBar,
  AudioPlayer,
} from "@/registry/default/ui/audio/player";
import {
  AudioQueue,
  AudioQueuePreferences,
} from "@/registry/default/ui/audio/queue";

export default function AudioQueuePreferencesDemo() {
  return (
    <AudioPlayer className="w-max">
      <AudioControlBar>
        <AudioQueuePreferences />
        <AudioQueue />
      </AudioControlBar>
    </AudioPlayer>
  );
}
