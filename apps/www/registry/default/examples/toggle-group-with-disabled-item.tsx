import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react";

import { Toggle, ToggleGroup } from "@/registry/default/ui/toggle-group";

export default function ToggleGroupWithDisabledItem() {
  return (
    <ToggleGroup defaultValue={["bold"]}>
      <Toggle aria-label="Toggle bold" value="bold">
        <BoldIcon />
      </Toggle>
      <Toggle aria-label="Toggle italic" disabled value="italic">
        <ItalicIcon />
      </Toggle>
      <Toggle aria-label="Toggle underline" value="underline">
        <UnderlineIcon />
      </Toggle>
    </ToggleGroup>
  );
}
