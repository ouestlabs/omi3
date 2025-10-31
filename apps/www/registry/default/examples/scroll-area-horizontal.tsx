import { ScrollArea } from "@/registry/default/ui/scroll-area";

export default function ScrollAreaHorizontal() {
  return (
    <ScrollArea className="max-w-96 rounded-md border" orientation="horizontal">
      <div className="flex w-max gap-4 p-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            className="flex h-20 w-32 shrink-0 items-center justify-center rounded-md bg-muted"
            key={i}
          >
            <span className="font-medium text-sm">Item {i + 1}</span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
