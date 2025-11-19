import { type NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = ["ice2.tuxnet.me"];

export async function GET(
  request: NextRequest,
  { params }: RouteContext<"/radio/[...path]">
) {
  const { path } = await params;
  const pathString = path.join("/");

  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const host = searchParams.get("host");

  if (!(host && ALLOWED_HOSTS.includes(host))) {
    return new NextResponse("Invalid host", { status: 400 });
  }

  try {
    const targetUrl = `http://${host}:8000/${pathString}`;

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return new NextResponse("Failed to fetch radio stream", {
        status: response.status,
      });
    }

    const contentType = response.headers.get("content-type") || "audio/aac";
    const contentLength = response.headers.get("content-length");

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    if (contentLength) {
      headers.set("Content-Length", contentLength);
    }

    const stream = response.body;
    if (!stream) {
      return new NextResponse("No stream available", { status: 500 });
    }

    return new NextResponse(stream, { headers });
  } catch (error) {
    console.error("Radio proxy error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function HEAD(
  request: NextRequest,
  { params }: RouteContext<"/radio/[...path]">
) {
  return await GET(request, { params });
}
