import { DownloadIcon } from "lucide-react";

import { Button } from "@/registry/default/ui/button";

export default function ButtonWithIcon() {
  return (
    <Button>
      <DownloadIcon />
      Download
    </Button>
  );
}
