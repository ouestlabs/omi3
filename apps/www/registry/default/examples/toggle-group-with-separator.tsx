import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react";

import {
  Toggle,
  ToggleGroup,
  ToggleGroupSeparator,
} from "@/registry/default/ui/toggle-group";

export default function ToggleGroupWithSeparator() {
  return (
    <ToggleGroup defaultValue={["bold"]}>
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
