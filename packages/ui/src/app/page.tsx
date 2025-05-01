import { AudioPlayer } from "@omi3/ui/registry/new-york/blocks/audio/player";
import { ThemeToggler } from "@omi3/ui/theme/toogler";
import { cn } from "../lib/utils";
import { buttonVariants } from "../components/button";
import { ScriptBlock } from "../components/script-block";

const customCommandMap = {
  npm: "npm run shadcn add 'https://omi3.ouestlabs.com/registry/audio-player'",
  yarn: "yarn shadcn add 'https://omi3.ouestlabs.com/registry/audio-player'",
  pnpm: "pnpm dlx shadcn@latest add 'https://omi3.ouestlabs.com/registry/audio-player'",
  bun: "bun x shadcn@latest add 'https://omi3.ouestlabs.com/registry/audio-player'",
};

export default function Home() {
  return (
    <main className="flex flex-col justify-center flex-1 gap-2 p-2">
      <ScriptBlock
        commandMap={customCommandMap}
      />
      <AudioPlayer />
    </main>
  );
}
