"use client";

import { AlertCircleIcon, RefreshCwIcon } from "lucide-react";
import React from "react";
import { useAudioStore } from "@/registry/default/lib/audio-store";
import { cn } from "@/registry/default/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/registry/default/ui/alert";
import { Button } from "@/registry/default/ui/button";

export type AudioErrorDisplayProps = React.ComponentProps<typeof Alert> & {
  showRetry?: boolean;
  retryLabel?: string;
  onRetry?: () => void;
  variant?: "default" | "compact" | "inline";
};

function AudioErrorDisplay({
  className,
  showRetry = true,
  retryLabel = "Retry",
  onRetry,
  variant = "default",
  ...props
}: AudioErrorDisplayProps) {
  const isError = useAudioStore((state) => state.isError);
  const errorMessage = useAudioStore((state) => state.errorMessage);
  const currentTrack = useAudioStore((state) => state.currentTrack);
  const setError = useAudioStore((state) => state.setError);
  const setQueueAndPlay = useAudioStore((state) => state.setQueueAndPlay);
  const queue = useAudioStore((state) => state.queue);
  const currentQueueIndex = useAudioStore((state) => state.currentQueueIndex);

  const handleRetry = React.useCallback(() => {
    if (onRetry) {
      onRetry();
      return;
    }

    if (currentTrack && currentQueueIndex >= 0) {
      setError(null);
      setQueueAndPlay(queue, currentQueueIndex);
    } else {
      setError(null);
    }
  }, [
    onRetry,
    currentTrack,
    currentQueueIndex,
    queue,
    setError,
    setQueueAndPlay,
  ]);

  if (!isError || !errorMessage) {
    return null;
  }

  if (variant === "inline") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-2 text-destructive text-sm",
          className
        )}
        data-slot="audio-error-display"
        {...props}
      >
        <AlertCircleIcon className="size-4 shrink-0" />
        <span className="flex-1 truncate">{errorMessage}</span>
        {showRetry && (
          <Button
            onClick={handleRetry}
            size="icon-sm"
            variant="ghost"
          >
            <RefreshCwIcon className="size-3" />
          </Button>
        )}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <Alert
        className={cn("border-destructive/50 bg-destructive/10", className)}
        data-slot="audio-error-display"
        {...props}
      >
        <AlertCircleIcon className="size-4" />
        <AlertTitle className="text-sm">Error</AlertTitle>
        <AlertDescription className="text-xs">{errorMessage}</AlertDescription>
        {showRetry && (
          <Button
            className="mt-2"
            onClick={handleRetry}
            size="sm"
            variant="outline"
          >
            <RefreshCwIcon className="mr-2 size-3" />
            {retryLabel}
          </Button>
        )}
      </Alert>
    );
  }

  return (
    <Alert
      className={cn("border-destructive/50 bg-destructive/10", className)}
      data-slot="audio-error-display"
      {...props}
    >
      <AlertCircleIcon className="size-4" />
      <AlertTitle>Playback Error</AlertTitle>
      <AlertDescription>{errorMessage}</AlertDescription>
      {showRetry && (
        <div className="mt-4">
          <Button
            onClick={handleRetry}
            size="sm"
            variant="outline"
          >
            <RefreshCwIcon className="mr-2 size-4" />
            {retryLabel}
          </Button>
        </div>
      )}
    </Alert>
  );
}

export { AudioErrorDisplay };
