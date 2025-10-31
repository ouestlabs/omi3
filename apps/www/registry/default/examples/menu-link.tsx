import Link from "next/link";

import { Button } from "@/registry/default/ui/button";
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from "@/registry/default/ui/menu";

export default function MenuLinkDemo() {
  return (
    <Menu>
      <MenuTrigger render={<Button variant="outline" />}>Open menu</MenuTrigger>
      <MenuPopup>
        <MenuItem render={<Link href="/docs" />}>Docs</MenuItem>
        <MenuItem render={<Link href="/particles" />}>Particles</MenuItem>
      </MenuPopup>
    </Menu>
  );
}
