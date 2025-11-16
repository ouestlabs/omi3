import {
  AudioQueue,
  AudioQueuePreferences,
  AudioQueueRepeatMode,
  AudioQueueShuffle,
} from "@/registry/default/ui/audio/queue";
import { AudioControlBar, AudioPlayer } from "../ui/audio/player";

export default function AudioQueueAllControlsDemo() {
  return (
    <AudioPlayer className="w-max">
      <AudioControlBar>
        <AudioQueueShuffle />
        <AudioQueueRepeatMode />
        <AudioQueuePreferences />
        <AudioQueue />
      </AudioControlBar>
    </AudioPlayer>
  );
}
