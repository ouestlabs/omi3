"use client";

import { CopyIcon, CopySuccessIcon } from "@audio-ui/icons";

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

import { Button } from "@/registry/default/ui/button";

function DocsCopyPage({ page }: { page: string }) {
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  return (
    <Button onClick={() => copyToClipboard(page)} size="xs" variant="outline">
      {isCopied ? (
        <CopySuccessIcon />
      ) : (
        <CopyIcon />  
      )}
      Copy Markdown
    </Button>
  );
}

export { DocsCopyPage };
