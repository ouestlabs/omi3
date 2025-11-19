"use client";
import { toast } from "sonner";
import { useAudioStore } from "@/lib/audio-store";
import { AudioTrackList } from "@/components/audio/track";

export default function AudioTrackSortableListGridDemo() {
  const queue = useAudioStore((state) => state.queue);

  return (
    <AudioTrackList
      className="w-full"
      onTrackSelect={(index) => {
        const track = queue[index];
        toast.info(`Playing ${track?.title}`);
      }}
      sortable
      variant="grid"
    />
  );
}
