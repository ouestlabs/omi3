import { BoldIcon } from "lucide-react";

import { Toggle } from "@/registry/default/ui/toggle";

export default function ToggleWithIcon() {
  return (
    <Toggle aria-label="Toggle bold" variant="outline">
      <BoldIcon />
    </Toggle>
  );
}
