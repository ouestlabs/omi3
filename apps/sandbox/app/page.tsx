import ParticlePlayerWidget from "@/components/audio/particles/particle-player-widget";
import { AudioProvider, demoTracks } from "@/components/audio/provider";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between px-16 py-32 sm:items-start">
        <AudioProvider tracks={demoTracks}>
          <ParticlePlayerWidget />
        </AudioProvider>
      </main>
    </div>
  );
}
