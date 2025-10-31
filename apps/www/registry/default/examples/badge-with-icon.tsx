import { CheckIcon } from "lucide-react";

import { Badge } from "@/registry/default/ui/badge";

export default function BadgeWithIcon() {
  return (
    <Badge variant="outline">
      <CheckIcon />
      Verified
    </Badge>
  );
}
