"use client";

import { Button } from "@/registry/default/ui/button";
import { toastManager } from "@/registry/default/ui/toast";

export default function ToastLoading() {
  return (
    <Button
      onClick={() => {
        toastManager.add({
          title: "Loading…",
          description: "Please wait while we process your request.",
          type: "loading",
        });
      }}
      variant="outline"
    >
      Loading Toast
    </Button>
  );
}
