"use client";

import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Button } from "@/registry/default/ui/button";

function DocsCopyPage({ page }: { page: string }) {
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  return (
    <Button onClick={() => copyToClipboard(page)} size="sm" variant="outline">
      {isCopied ? <CopyCheckIcon /> : <CopyIcon />}
      Copy Markdown
    </Button>
  );
}

export { DocsCopyPage };
