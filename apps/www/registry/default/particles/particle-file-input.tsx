"use client";

import { type Music, useAudio } from "audio-engine/react";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/registry/default/ui/input";
import { Label } from "@/registry/default/ui/label";
import { toastManager } from "@/registry/default/ui/toast";

type AudioFileInputProps = React.ComponentProps<typeof Input> & {
  label?: string;
};

function AudioFileInput({
  label = "Load a local audio file:",
  className,
  ...props
}: AudioFileInputProps) {
  const { isLoading, isEngineInitialized, load } = useAudio();
  const [currentBlobUrl, setCurrentBlobUrl] = useState<string | null>(null);
  const id = React.useId();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0 && isEngineInitialized) {
      const file = files[0];

      if (!file?.type.startsWith("audio/")) {
        toastManager.add({
          title: "Invalid audio file",
          description: "Please select a valid audio file",
          type: "error",
        });

        return;
      }

      if (currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl);
      }

      const blobUrl = URL.createObjectURL(file);
      setCurrentBlobUrl(blobUrl);

      const music: Music = {
        title: file.name,
        artist: "Unknown artist",
        url: blobUrl,
      };

      load(music);
    }
  };

  useEffect(
    () => () => {
      if (currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl);
      }
    },
    [currentBlobUrl]
  );

  const isDisabled = !isEngineInitialized || isLoading;

  return (
    <div
      className="flex flex-col gap-2"
      data-state={isDisabled ? "disabled" : "enabled"}
    >
      {label && (
        <Label className="font-medium text-sm" htmlFor={id}>
          {label}
        </Label>
      )}
      <Input
        accept="audio/*"
        className={cn(className)}
        disabled={isDisabled}
        id={id}
        onChange={handleFileChange}
        type="file"
        {...props}
      />
      {isLoading && (
        <span className="text-muted-foreground text-xs">
          Loading audio engine...
        </span>
      )}
    </div>
  );
}

export default AudioFileInput;
