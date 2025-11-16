import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { loadGoogleFont } from "@/lib/font";
import { source } from "@/lib/source";

export const revalidate = false;
export const size = {
  width: 1200,
  height: 630,
};
const WAVEFORM_HEIGHT_MULTIPLIER = 0.2;
const WAVEFORM_HEIGHT = 100;
const WAVEFORM_HEIGHT_OFFSET = 500;
const WAVEFORM_COLOR = "#e4e4e4";
const BACKGROUND_COLOR = "#0c0c0c";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) {
    notFound();
  }

  const fontData = await loadGoogleFont(
    "Instrument Serif",
    `audio/ui ${page.data.title}`
  );

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
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
        }}
      >
        <p
          style={{
            fontSize: "5rem",
            fontWeight: 600,
            textAlign: "center",
            color: "dimgray",
            fontFamily: "Instrument Serif",
            margin: 0,
            lineHeight: "1",
          }}
        >
          audio/ui
        </p>
        <p
          style={{
            fontSize: "7rem",
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
            fontFamily: "Instrument Serif",
            margin: 0,
            lineHeight: "1",
          }}
        >
          {page.data.title}
        </p>
      </div>
    </div>,
    {
      ...size,
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

export function generateStaticParams() {
  return source.generateParams().map((params) => ({
    slug: params.slug ?? [],
  }));
}
