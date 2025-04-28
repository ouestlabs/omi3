import { promises as fs } from "node:fs"
import path from "node:path"
import { NextResponse } from "next/server"
import { registryItemSchema } from "shadcn/registry"

export const generateStaticParams = async () => {
  const registryData = await import("../../../../registry.json");
  const registry = registryData.default;

  return registry.items.map((item) => ({
    name: item.name,
  }));
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params
    const registryData = await import("../../../../registry.json")
    const registry = registryData.default

    const component = registry.items.find((c) => c.name === name)

    if (!component) {
      return NextResponse.json(
        { error: "Component not found" },
        { status: 404 }
      )
    }

    const registryItem = registryItemSchema.parse(component)

    if (!registryItem.files?.length) {
      return NextResponse.json(
        { error: "Component has no files" },
        { status: 400 }
      )
    }

    const filesWithContent = await Promise.all(
      registryItem.files.map(async (file) => {
        const filePath = path.join(process.cwd(), file.path)
        const content = await fs.readFile(filePath, "utf8")
        return { ...file, content }
      })
    )

    return NextResponse.json({ ...registryItem, files: filesWithContent })
  } catch (error) {
    console.error("Error processing component request:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
