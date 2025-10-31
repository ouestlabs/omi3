import Link from "next/link";

import { Button } from "@/registry/default/ui/button";

export default function ButtonWithLink() {
  return <Button render={<Link href="/" />}>Link</Button>;
}
