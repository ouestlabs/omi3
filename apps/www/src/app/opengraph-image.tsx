import { ImageResponse } from "next/og";
import { loadGoogleFont } from "@/lib/font";

export const runtime = "edge";
export const alt = "audio/ui - audio components for the web";

const WAVEFORM_HEIGHT_MULTIPLIER = 0.2;
const WAVEFORM_HEIGHT = 100;
const WAVEFORM_HEIGHT_OFFSET = 500;
const WAVEFORM_COLOR = "#e4e4e4";
const BACKGROUND_COLOR = "#0c0c0c";

export default async function Image() {
  const fontData = await loadGoogleFont("Instrument Serif", "audio/ui");

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: BACKGROUND_COLOR,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.07,
        }}
      >
        {Array.from({ length: 120 }).map((_, i) => (
          <div
            key={i.toString()}
            style={{
              width: "5px",
              height: `${Math.sin(i * WAVEFORM_HEIGHT_MULTIPLIER) * WAVEFORM_HEIGHT + WAVEFORM_HEIGHT_OFFSET}px`,
              background: WAVEFORM_COLOR,
              margin: "0 8px",
              borderRadius: "2px",
            }}
          />
        ))}
      </div>
      <p
        style={{
          fontSize: "10em",
          fontWeight: "bold",
          color: "white",
          marginTop: "-3px",
          marginBottom: "0",
          textAlign: "center",
          fontFamily: "Instrument Serif",
        }}
      >
        audio/ui
      </p>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Instrument Serif",
          data: fontData,
          style: "normal",
        },
      ],
    }
  );
}
