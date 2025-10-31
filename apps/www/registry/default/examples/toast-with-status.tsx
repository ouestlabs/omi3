"use client";

import { Button } from "@/registry/default/ui/button";
import { toastManager } from "@/registry/default/ui/toast";

export default function ToastWithStatus() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() => {
          toastManager.add({
            title: "Success!",
            description: "Your changes have been saved.",
            type: "success",
          });
        }}
        variant="outline"
      >
        Success Toast
      </Button>
      <Button
        onClick={() => {
          toastManager.add({
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
            type: "error",
          });
        }}
        variant="outline"
      >
        Error Toast
      </Button>
      <Button
        onClick={() => {
          toastManager.add({
            title: "Heads up!",
            description: "You can add components to your app using the cli.",
            type: "info",
          });
        }}
        variant="outline"
      >
        Info Toast
      </Button>
      <Button
        onClick={() => {
          toastManager.add({
            title: "Warning!",
            description: "Your session is about to expire.",
            type: "warning",
          });
        }}
        variant="outline"
      >
        Warning Toast
      </Button>
    </div>
  );
}
