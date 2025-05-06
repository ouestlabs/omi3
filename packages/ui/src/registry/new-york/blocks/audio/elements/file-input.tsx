"use client";

import {
  type Music,
  useAudio
} from "@omi3/audio/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import React, { useRef, useEffect, useState } from "react";
import { toast } from "sonner";

type AudioFileInputProps = React.ComponentProps<typeof Input> & {
  label?: string;
};

export function AudioFileInput({
  label = "Load a local audio file:",
  className,
  ...props
}: AudioFileInputProps) {
  const {
    isLoading,
    isEngineInitialized,
    load,
  } = useAudio();
  const [currentBlobUrl, setCurrentBlobUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = React.useId();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0 && isEngineInitialized) {
      const file = files[0];

      if (!file || !file.type.startsWith("audio/")) {
        toast.error("Invalid audio file");
        if (inputRef.current) { inputRef.current.value = ""; }
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
        url: blobUrl
      };

      load(music);
    }
  };

  useEffect(() => {
    return () => {
      if (currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl);
      }
    };
  }, [currentBlobUrl]);

  const isDisabled = !isEngineInitialized || isLoading;

  return (
    <div className="flex flex-col gap-2" data-state={isDisabled ? "disabled" : "enabled"}>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
      )}
      <Input
        ref={inputRef}
        id={id}
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        disabled={isDisabled}
        className={cn(className)}
        {...props}
      />
      {isLoading && (
        <span className="text-xs text-muted-foreground">Loading audio engine...</span>
      )}
    </div>
  );
}
