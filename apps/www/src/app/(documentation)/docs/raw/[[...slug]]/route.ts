import { notFound } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";
import { source } from "@/lib/source";

export const revalidate = false;

export async function GET(
  _req: NextRequest,
  { params }: RouteContext<"/docs/raw/[[...slug]]">
) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) {
    notFound();
  }
  const processed = await page.data.getText?.("processed");
  if (!processed) {
    notFound();
  }
  return new NextResponse(`# ${page.data.title}\n\n${processed}`, {
    headers: {
      "Content-Type": "text/markdown",
    },
  });
}
