import {
  Geist_Mono as FontMono,
  Bricolage_Grotesque as FontSans,
  Instrument_Serif as FontSerif,
} from "next/font/google";

const FONT_REGEX = /src: url\((.+)\) format\('(opentype|truetype)'\)/;

async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(FONT_REGEX);

  if (resource) {
    const response = await fetch(resource[1] ?? "");
    if (response.status === 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const fontSerif = FontSerif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-serif",
});
const fontMono = FontMono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
});

export { loadGoogleFont, fontSans, fontSerif, fontMono };
