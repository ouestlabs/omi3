import { AudioPlayer } from "@omi3/ui/registry/new-york/blocks/audio/player";
import { ThemeToggler } from "@omi3/ui/theme/toogler";
export default function Home() {
  return (
    <main className="flex flex-col justify-center flex-1 gap-2 p-2">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">audiocn</h1>
        <ThemeToggler />
      </header>
      <AudioPlayer />
    </main>
  )
}
