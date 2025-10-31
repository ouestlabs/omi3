import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react";

import { Toggle } from "@/registry/default/ui/toggle";

export default function ToggleIconGroup() {
  return (
    <div className="flex items-center gap-1">
      <Toggle aria-label="Toggle bold" variant="outline">
        <BoldIcon />
      </Toggle>
      <Toggle aria-label="Toggle italic" variant="outline">
        <ItalicIcon />
      </Toggle>
      <Toggle aria-label="Toggle underline" variant="outline">
        <UnderlineIcon />
      </Toggle>
    </div>
  );
}
