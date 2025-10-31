import { EllipsisIcon, FilesIcon, FilmIcon } from "lucide-react";

import { Button } from "@/registry/default/ui/button";
import { Group, GroupItem, GroupSeparator } from "@/registry/default/ui/group";

export default function GroupDemo() {
  return (
    <Group>
      <GroupItem render={<Button variant="outline" />}>
        <FilesIcon />
        Files
      </GroupItem>
      <GroupSeparator />
      <GroupItem render={<Button variant="outline" />}>
        <FilmIcon />
        Media
      </GroupItem>
      <GroupSeparator />
      <GroupItem
        render={<Button aria-label="Menu" size="icon" variant="outline" />}
      >
        <EllipsisIcon />
      </GroupItem>
    </Group>
  );
}
