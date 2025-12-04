import { useCallback, useEffect, useRef } from "react";

/**
 * Custom React hook to load and play a sound from a given URL using the Web Audio API.
 *
 * This hook fetches the audio file at the specified URL, decodes it, and prepares it for playback.
 * It returns a `play` function that can be called to play the loaded sound.
 *
 * @param url - The URL of the audio file to load and play.
 * @returns A function that, when called, plays the loaded sound.
 *
 * @remarks
 * - If the Web Audio API is not supported in the browser, a warning is logged and playback is disabled.
 * - The audio context and buffer are managed internally using React refs.
 * - Errors during fetching or decoding the audio are logged to the console.
 *
 * @example
 * ```tsx
 * const playClick = useSound('/sounds/click.mp3');
 * // Later in an event handler:
 * playClick();
 * ```
 */
export function useSound(url: string) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextClass) {
      console.warn("Web Audio API is not supported in this browser.");
      return;
    }

    const audioCtx = new AudioContextClass();
    audioCtxRef.current = audioCtx;

    fetch(url)
      .then((res) => res.arrayBuffer())
      .then((data) => audioCtx.decodeAudioData(data))
      .then((decoded) => {
        bufferRef.current = decoded;
      })
      .catch((err) => {
        console.log(`Failed to load click sound from ${url}:`, err);
      });
  }, [url]);

  const play = useCallback((volume = 1) => {
    if (audioCtxRef.current && bufferRef.current) {
      const source = audioCtxRef.current.createBufferSource();
      const gainNode = audioCtxRef.current.createGain();

      source.buffer = bufferRef.current;
      gainNode.gain.value = volume;

      source.connect(gainNode);
      gainNode.connect(audioCtxRef.current.destination);
      source.start(0);
    }
  }, []);

  return play;
}
