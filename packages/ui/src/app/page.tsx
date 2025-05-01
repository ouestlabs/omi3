import { AudioPlayer } from "@omi3/ui/registry/new-york/blocks/audio/player";
import { ScriptBlock } from "../components/script-block";
import { addAudioPlayerCommands } from "@omi3/ui/lib/commands";

export default function Home() {
  return (
    <main className="flex flex-col justify-center flex-1 gap-2 p-2">
      <ScriptBlock
        commandMap={addAudioPlayerCommands}
      />
      <AudioPlayer />
    </main>
  );
}
