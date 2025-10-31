import { Button } from "@/registry/default/ui/button";
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
  MenuTrigger,
} from "@/registry/default/ui/menu";

export default function MenuNestedDemo() {
  return (
    <Menu>
      <MenuTrigger render={<Button variant="outline" />}>Open menu</MenuTrigger>
      <MenuPopup>
        <MenuItem>Item one</MenuItem>
        <MenuSub>
          <MenuSubTrigger>More</MenuSubTrigger>
          <MenuSubPopup>
            <MenuItem>Sub item A</MenuItem>
            <MenuItem>Sub item B</MenuItem>
          </MenuSubPopup>
        </MenuSub>
        <MenuItem>Item two</MenuItem>
      </MenuPopup>
    </Menu>
  );
}
