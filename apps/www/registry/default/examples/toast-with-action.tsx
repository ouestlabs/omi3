"use client";

import { Button } from "@/registry/default/ui/button";
import { toastManager } from "@/registry/default/ui/toast";

export default function ToastWithAction() {
  return (
    <Button
      onClick={() => {
        const id = toastManager.add({
          title: "Action performed",
          description: "You can undo this action.",
          type: "success",
          actionProps: {
            children: "Undo",
            onClick: () => {
              toastManager.close(id);
              toastManager.add({
                title: "Action undone",
                description: "The action has been reverted.",
                type: "info",
              });
            },
          },
          timeout: 1_000_000,
        });
      }}
      variant="outline"
    >
      Perform Action
    </Button>
  );
}
