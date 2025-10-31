import Link from "next/link";

import { Badge } from "@/registry/default/ui/badge";

export default function BadgeWithLink() {
  return <Badge render={<Link href="/" />}>Badge</Badge>;
}
