import {
  AudioControlBar,
  AudioPlayer,
} from "@/registry/default/ui/audio/player";
import {
  AudioQueue,
  AudioQueueRepeatMode,
  AudioQueueShuffle,
} from "@/registry/default/ui/audio/queue";

export default function AudioQueueShuffleRepeatDemo() {
  return (
    <AudioPlayer className="w-max">
      <AudioControlBar>
        <AudioQueueShuffle />
        <AudioQueueRepeatMode />
        <AudioQueue />
      </AudioControlBar>
    </AudioPlayer>
  );
}
