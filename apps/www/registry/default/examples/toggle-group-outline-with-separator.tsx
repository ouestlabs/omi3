import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react";

import {
  Toggle,
  ToggleGroup,
  ToggleGroupSeparator,
} from "@/registry/default/ui/toggle-group";

export default function ToggleGroupOutlineWithSeparator() {
  return (
    <ToggleGroup defaultValue={["bold"]} variant="outline">
      <Toggle aria-label="Toggle bold" value="bold">
        <BoldIcon />
      </Toggle>
      <ToggleGroupSeparator />
      <Toggle aria-label="Toggle italic" value="italic">
        <ItalicIcon />
      </Toggle>
      <ToggleGroupSeparator />
      <Toggle aria-label="Toggle underline" value="underline">
        <UnderlineIcon />
      </Toggle>
    </ToggleGroup>
  );
}
