import {
  AudioPlayer,
  AudioPlayerControlBar,
} from "@/registry/default/ui/audio/player";
import {
  AudioQueue,
  AudioQueueRepeatMode,
  AudioQueueShuffle,
} from "@/registry/default/ui/audio/queue";

export default function AudioQueueShuffleRepeatDemo() {
  return (
    <AudioPlayer className="w-max">
      <AudioPlayerControlBar>
        <AudioQueueShuffle />
        <AudioQueueRepeatMode />
        <AudioQueue />
      </AudioPlayerControlBar>
    </AudioPlayer>
  );
}
