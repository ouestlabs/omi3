import { CopyIcon } from "lucide-react";

import { Button } from "@/registry/default/ui/button";
import { Group, GroupItem, GroupSeparator } from "@/registry/default/ui/group";
import { Input } from "@/registry/default/ui/input";

export default function GroupWithInput() {
  return (
    <Group>
      <GroupItem
        render={<Input defaultValue="https://coss.com" type="text" />}
      />
      <GroupSeparator />
      <GroupItem
        render={<Button aria-label="Copy" size="icon" variant="outline" />}
      >
        <CopyIcon />
      </GroupItem>
    </Group>
  );
}
