"use client";

import {
  BackwardIcon,
  CheckCircleIcon,
  ForwardIcon,
  MusicIcon,
  NextIcon,
  PauseIcon,
  PlayIcon,
  PreviousIcon,
  Setting2Icon,
  VolumeHighIcon,
  VolumeLow1Icon,
  VolumeLowIcon,
  VolumeMutedIcon,
} from "@audio-ui/icons";
import { formatDuration, formatSecondsToISO8601 } from "@audio-ui/utils";
import { Input } from "@base-ui-components/react/input";
import { mergeProps } from "@base-ui-components/react/merge-props";
import { useRender } from "@base-ui-components/react/use-render";
import {
  AudioProvider,
  PlaybackState,
  type QueueItem,
  useAudio,
} from "audio-engine/react";
import {
  type ComponentProps,
  type HTMLProps,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/registry/default/ui/button";
import { Cover, CoverFallback, CoverImage } from "@/registry/default/ui/cover";
import { Label } from "@/registry/default/ui/label";
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from "@/registry/default/ui/menu";
import { Skeleton } from "@/registry/default/ui/skeleton";
import { Slider } from "@/registry/default/ui/slider";
import { Spinner } from "@/registry/default/ui/spinner";
import { toastManager } from "@/registry/default/ui/toast";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/registry/default/ui/tooltip";

const ACTION_PENDING_DELAY = 100;

function Player({ children }: { children: React.ReactNode }) {
  return <AudioProvider>{children}</AudioProvider>;
}

type PlayerFileInputProps = React.ComponentProps<typeof Input> & {
  label?: string;
};

function PlayerFileInput({
  label = "Load a local audio file:",
  className,
  ...props
}: PlayerFileInputProps) {
  const audio = useAudio();
  const isLoading = audio.state.playback.isLoading;
  const isEngineInitialized = audio.state.status.isInitialized;
  const load = audio.actions.playback.load;
  const [currentBlobUrl, setCurrentBlobUrl] = useState<string | null>(null);
  const id = useId();

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

      const track = {
        title: file.name,
        artist: "Audio UI",
        url: blobUrl,
      };

      load(track);
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
        className={cn("borderr", className)}
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

type PlayerTrackInfoProps = React.ComponentProps<"div">;

function PlayerTrackInfo({ className, ...props }: PlayerTrackInfoProps) {
  const audio = useAudio();
  const isLoading = audio.state.playback.isLoading;
  const error = audio.state.error.error;
  const currentTrack = audio.state.playback.currentTrack;

  if (isLoading) {
    return (
      <div
        className={cn("flex w-full items-center space-x-2 truncate", className)}
        {...props}
        aria-busy="true"
        aria-live="polite"
        data-state="loading"
      >
        <Cover className="shrink-0 rounded-sm" itemProp="image">
          <CoverFallback className="rounded-sm">
            <MusicIcon className="text-muted-foreground" />
          </CoverFallback>
        </Cover>
        <dl className="space-y-0.5">
          <div>
            <dt className="sr-only">Title</dt>
            <dd className="truncate font-medium text-sm" itemProp="name">
              <Skeleton className="h-3 w-[150px]" />{" "}
            </dd>
          </div>
          <div>
            <dt className="sr-only">Artist</dt>
            <dd
              className="truncate text-muted-foreground text-xs"
              itemProp="byArtist"
            >
              <Skeleton className="h-3 w-[100px]" />
            </dd>
          </div>
        </dl>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "flex w-full items-center space-x-2 truncate text-destructive",
          className
        )}
        {...props}
        data-state="error"
        role="alert"
      >
        <Cover className="shrink-0 rounded-sm" itemProp="image">
          <CoverFallback className="rounded-sm">
            <MusicIcon className="text-muted-foreground" />
          </CoverFallback>
        </Cover>
        <dl className="overflow-hidden">
          <div>
            <dt className="sr-only">Title</dt>
            <dd className="truncate font-medium text-sm" itemProp="name">
              Error loading track
            </dd>
          </div>
          <div>
            <dt className="sr-only">Artist</dt>
            <dd
              className="-mt-1 truncate text-muted-foreground text-xs"
              itemProp="byArtist"
            >
              {error.message || "An unknown error occurred."}
            </dd>
          </div>
        </dl>
      </div>
    );
  }

  if (!currentTrack) {
    return (
      <div
        className={cn("flex w-full items-center space-x-2 truncate", className)}
        {...props}
        data-state="empty"
      >
        <Cover className="shrink-0 rounded-sm" itemProp="image">
          <CoverFallback className="rounded-sm">
            <MusicIcon className="text-muted-foreground" />
          </CoverFallback>
        </Cover>
        <dl className="overflow-hidden">
          <div>
            <dt className="sr-only">Title</dt>
            <dd className="truncate font-medium text-sm" itemProp="name">
              No track selected
            </dd>
          </div>
          <div>
            <dt className="sr-only">Artist</dt>
            <dd
              className="-mt-1 truncate text-muted-foreground text-xs"
              itemProp="byArtist"
            >
              Please select a track
            </dd>
          </div>
        </dl>
      </div>
    );
  }

  return (
    <div
      className={cn("flex w-full items-center space-x-2 truncate", className)}
      itemScope
      itemType="https://schema.org/MusicRecording"
      {...props}
      data-state="loaded"
    >
      <Cover className="shrink-0 rounded-sm" itemProp="image">
        {currentTrack.artwork && (
          <CoverImage
            alt={`Artwork for ${currentTrack.title || "track"}`}
            className="object-cover"
            src={currentTrack.artwork.src}
          />
        )}
        <CoverFallback className="rounded-sm">
          <MusicIcon className="text-muted-foreground" />
        </CoverFallback>
      </Cover>
      <dl className="overflow-hidden">
        <div>
          <dt className="sr-only">Title</dt>
          <dd className="truncate font-medium text-sm" itemProp="name">
            {currentTrack.title || "Unknown Title"}
          </dd>
        </div>
        <div>
          <dt className="sr-only">Artist</dt>
          <dd
            className="-mt-1 truncate text-muted-foreground text-xs"
            itemProp="byArtist"
          >
            {currentTrack.artist || "Unknown Artist"}
          </dd>
        </div>
      </dl>
    </div>
  );
}

interface PlayPauseButtonProps<TData = unknown>
  extends React.ComponentProps<typeof Button> {
  item?: QueueItem<TData>;
}

function PlayPauseButton<TData = unknown>({
  item,
  className,
  onClick,
  size = "icon",
  ...otherProps
}: PlayPauseButtonProps<TData>) {
  const audio = useAudio();
  const isPlaying = audio.state.playback.isPlaying;
  const isLoading = audio.state.playback.isLoading;
  const isBuffering = audio.state.playback.isBuffering;
  const playbackState = audio.state.playback.state;
  const currentTrack = audio.state.playback.currentTrack;
  const isEngineInitialized = audio.state.status.isInitialized;
  const play = audio.actions.playback.play;
  const pause = audio.actions.playback.pause;

  const [isActionPending, setIsActionPending] = useState(false);
  const loading =
    !isEngineInitialized || isLoading || isBuffering || isActionPending;

  const canPlayPause = useMemo(
    () =>
      isEngineInitialized &&
      (playbackState === PlaybackState.READY ||
        playbackState === PlaybackState.PAUSED ||
        (playbackState === PlaybackState.IDLE && currentTrack != null)),
    [isEngineInitialized, playbackState, currentTrack]
  );

  const isPlayPauseDisabled = isActionPending || !(isPlaying || canPlayPause);

  const handlePlayPause = useCallback(async () => {
    if (isPlayPauseDisabled || isActionPending) {
      return;
    }

    setIsActionPending(true);
    if (isPlaying) {
      await Promise.resolve(pause());
    } else if (canPlayPause) {
      if (item) {
        await Promise.resolve(play(item));
      } else {
        await Promise.resolve(play());
      }
    }
    setTimeout(() => setIsActionPending(false), ACTION_PENDING_DELAY);
  }, [
    isPlayPauseDisabled,
    isActionPending,
    isPlaying,
    canPlayPause,
    item,
    pause,
    play,
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        event.key === " " &&
        target.tagName !== "INPUT" &&
        target.tagName !== "TEXTAREA" &&
        target.tagName !== "SELECT" &&
        !target.isContentEditable
      ) {
        event.preventDefault();
        handlePlayPause();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handlePlayPause]);

  const renderPlayPauseIcon = () => {
    if (loading) {
      return <Spinner />;
    }
    if (isPlaying) {
      return <PauseIcon />;
    }
    return <PlayIcon />;
  };

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            {...otherProps}
            aria-label={isPlaying ? "Pause" : "Play"}
            className={cn(className)}
            disabled={isPlayPauseDisabled}
            onClick={(e) => {
              handlePlayPause();
              onClick?.(e);
            }}
            size={size}
            type="button"
          >
            {renderPlayPauseIcon()}
          </Button>
        }
      />
      <TooltipPopup>
        <p>{isPlaying ? "Pause" : "Play"}</p>
      </TooltipPopup>
    </Tooltip>
  );
}

function PreviousButton({
  size = "icon",
  variant = "ghost",
  ...otherProps
}: React.ComponentProps<typeof Button>) {
  const audio = useAudio();
  const queue = audio.state.queue.items;
  const activeItemId = audio.state.queue.activeItemId;
  const previous = audio.actions.queue.previous;

  const handleClick = useCallback(() => {
    previous();
  }, [previous]);

  const isDisabled = !(queue && activeItemId);

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            {...otherProps}
            aria-label="Previous track"
            disabled={isDisabled}
            onClick={handleClick}
            size={size}
            type="button"
            variant={variant}
          />
        }
      >
        <PreviousIcon />
      </TooltipTrigger>
      <TooltipPopup>
        <p>Previous Track</p>
      </TooltipPopup>
    </Tooltip>
  );
}

function NextButton({
  size = "icon",
  variant = "ghost",
  ...otherProps
}: React.ComponentProps<typeof Button>) {
  const audio = useAudio();
  const queue = audio.state.queue.items;
  const activeItemId = audio.state.queue.activeItemId;
  const next = audio.actions.queue.next;

  const handleClick = useCallback(() => {
    next();
  }, [next]);

  const isDisabled = !(queue && activeItemId);

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            {...otherProps}
            aria-label="Next track"
            disabled={isDisabled}
            onClick={handleClick}
            size={size}
            type="button"
            variant={variant}
          />
        }
      >
        <NextIcon />
      </TooltipTrigger>
      <TooltipPopup>
        <p>Next Track</p>
      </TooltipPopup>
    </Tooltip>
  );
}

const SKIP_BACKWARD_SECONDS = 10;
const SKIP_FORWARD_SECONDS = 10;

function SkipBackwardButton({
  seconds = SKIP_BACKWARD_SECONDS,
  size = "icon",
  variant = "outline",
  ...otherProps
}: React.ComponentProps<typeof Button> & { seconds?: number }) {
  const audio = useAudio();
  const seek = audio.actions.playback.seek;
  const currentTime = audio.state.playback.currentTime;
  const duration = audio.state.playback.duration;

  // Use ref to access currentTime at click time instead of capturing it in callback
  const currentTimeRef = useRef(currentTime);
  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  const handleClick = useCallback(() => {
    const newTime = Math.max(0, currentTimeRef.current - seconds);
    seek(newTime);
  }, [seconds, seek]);

  const isDisabled = !duration || duration <= 0;

  return (
    <Button
      {...otherProps}
      aria-label={`Skip backward ${seconds} seconds`}
      disabled={isDisabled}
      onClick={handleClick}
      size={size}
      type="button"
      variant={variant}
    >
      <BackwardIcon />
    </Button>
  );
}

function SkipForwardButton({
  seconds = SKIP_FORWARD_SECONDS,
  size = "icon",
  variant = "outline",
  ...otherProps
}: React.ComponentProps<typeof Button> & { seconds?: number }) {
  const audio = useAudio();
  const seek = audio.actions.playback.seek;
  const currentTime = audio.state.playback.currentTime;
  const duration = audio.state.playback.duration;

  // Use ref to access currentTime at click time instead of capturing it in callback
  const currentTimeRef = useRef(currentTime);
  const durationRef = useRef(duration);
  useEffect(() => {
    currentTimeRef.current = currentTime;
    durationRef.current = duration;
  }, [currentTime, duration]);

  const handleClick = useCallback(() => {
    if (!durationRef.current) {
      return;
    }
    const newTime = Math.min(
      durationRef.current,
      currentTimeRef.current + seconds
    );
    seek(newTime);
  }, [seconds, seek]);

  const isDisabled = !duration || duration <= 0;

  return (
    <Button
      {...otherProps}
      aria-label={`Skip forward ${seconds} seconds`}
      disabled={isDisabled}
      onClick={handleClick}
      size={size}
      type="button"
      variant={variant}
    >
      <ForwardIcon />
    </Button>
  );
}

const PLAYBACK_SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const;

interface PlayerSpeedProps extends React.ComponentProps<typeof Button> {
  speeds?: readonly number[];
}

function PlayerSpeed({
  speeds = PLAYBACK_SPEEDS,
  className,
  variant = "outline",
  size = "icon",
  ...props
}: PlayerSpeedProps) {
  const audio = useAudio();
  const playbackRate = audio.state.playback.playbackRate;
  const setPlaybackRate = audio.actions.playback.setPlaybackRate;
  const currentSpeed = playbackRate;

  return (
    <Menu>
      <MenuTrigger
        render={
          <Button
            aria-label="Playback speed"
            className={cn(className)}
            size={size}
            variant={variant}
            {...props}
          />
        }
      >
        <Setting2Icon className="size-4" />
      </MenuTrigger>
      <MenuPopup align="end" className="min-w-[120px]">
        {speeds.map((speed) => (
          <MenuItem
            className="flex items-center justify-between"
            key={speed}
            onClick={() => setPlaybackRate(speed)}
          >
            <span className={speed === 1 ? "" : "font-mono"}>
              {speed === 1 ? "Normal" : `${speed}x`}
            </span>
            {currentSpeed === speed && <CheckCircleIcon className="size-4" />}
          </MenuItem>
        ))}
      </MenuPopup>
    </Menu>
  );
}

interface PlayerSpeedButtonGroupProps
  extends useRender.ComponentProps<"fieldset"> {
  speeds?: readonly number[];
}

function PlayerSpeedButtonGroup({
  speeds = [0.5, 1, 1.5, 2],
  className,
  render,
  ...props
}: PlayerSpeedButtonGroupProps) {
  const audio = useAudio();
  const playbackRate = audio.state.playback.playbackRate;
  const setPlaybackRate = audio.actions.playback.setPlaybackRate;
  const currentSpeed = playbackRate;

  const containerRef = useRef<HTMLFieldSetElement>(null);

  const defaultProps = {
    "aria-label": "Playback speed controls",
    className: cn("flex items-center gap-1 border-0 p-0", className),
    children: speeds.map((speed) => (
      <Button
        className="min-w-[50px] font-mono text-xs"
        key={speed}
        onClick={() => setPlaybackRate(speed)}
        size="sm"
        variant={currentSpeed === speed ? "default" : "outline"}
      >
        {speed}x
      </Button>
    )),
  };

  return useRender({
    defaultTagName: "fieldset",
    render,
    ref: containerRef,
    props: mergeProps<"fieldset">(defaultProps, props),
  });
}

// ============================================================================
// Volume Section
// ============================================================================

const VOLUME_THRESHOLD_LOW = 0.33;
const VOLUME_THRESHOLD_LOW_1 = 0.77;
const VOLUME_PERCENTAGE_MAX = 100;

interface PlayerVolumeProps
  extends Omit<ComponentProps<typeof Menu>, "children"> {
  className?: string;
  triggerClassName?: string;
  sliderProps?: ComponentProps<typeof Slider>;
}

function PlayerVolume({
  className,
  triggerClassName,
  sliderProps,
  ...props
}: PlayerVolumeProps) {
  const audio = useAudio();
  const volume = audio.state.volume.volume;
  const isMuted = audio.state.volume.isMuted;
  const isEngineInitialized = audio.state.status.isInitialized;
  const setVolume = audio.actions.volume.setVolume;

  const handleVolumeChange = useCallback(
    (value: number | readonly number[]) => {
      const newValue = Array.isArray(value) ? value[0] : value;
      if (isEngineInitialized && newValue !== undefined) {
        setVolume(newValue);
      }
    },
    [isEngineInitialized, setVolume]
  );

  const getVolumeIcon = useCallback(() => {
    if (!isEngineInitialized || isMuted || volume === 0) {
      return <VolumeMutedIcon />;
    }
    if (volume < VOLUME_THRESHOLD_LOW) {
      return <VolumeLowIcon />;
    }
    if (volume < VOLUME_THRESHOLD_LOW_1) {
      return <VolumeLow1Icon />;
    }
    return <VolumeHighIcon />;
  }, [isEngineInitialized, isMuted, volume]);

  const volumePercentage = Math.round(
    (isMuted ? 0 : volume) * VOLUME_PERCENTAGE_MAX
  );
  const currentVolume = isMuted ? 0 : volume;
  const isDisabled = !isEngineInitialized;

  const getDataState = () => {
    if (isMuted) {
      return "muted";
    }
    if (volume === 0) {
      return "zero";
    }
    return "active";
  };

  return (
    <Menu {...props}>
      <MenuTrigger
        render={
          <Button
            aria-label={`Volume Control: ${volumePercentage}%${isMuted ? " (Muted)" : ""}`}
            className={cn("hidden md:flex", triggerClassName)}
            data-state={getDataState()}
            disabled={isDisabled}
            size="icon"
            variant="ghost"
          />
        }
      >
        {getVolumeIcon()}
      </MenuTrigger>
      <MenuPopup align="center" className={cn("w-48 space-y-2 p-3", className)}>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Volume</span>
          <span className="font-medium text-sm tabular-nums">
            {volumePercentage}%
          </span>
        </div>
        <Slider
          aria-label="Volume Control Slider"
          className={cn("w-full", sliderProps?.className)}
          disabled={isDisabled}
          max={1}
          onValueChange={handleVolumeChange}
          step={0.01}
          value={[currentVolume]}
          {...sliderProps}
        />
      </MenuPopup>
    </Menu>
  );
}

// ============================================================================
// Progress Section
// ============================================================================

function PlayerProgress({
  ...otherProps
}: Omit<ComponentProps<typeof Slider>, "min" | "max" | "value">) {
  const audio = useAudio();
  const playbackState = audio.state.playback.state;
  const error = audio.state.error.error;
  const isEngineInitialized = audio.state.status.isInitialized;
  const seek = audio.actions.playback.seek;
  const currentTime = audio.state.playback.currentTime;
  const duration = audio.state.playback.duration;

  const [isDragging, setIsDragging] = useState(false);
  const [internalTime, setInternalTime] = useState(currentTime);

  useEffect(() => {
    if (!isDragging) {
      setInternalTime(currentTime);
    }
  }, [currentTime, isDragging]);

  useEffect(() => {
    if (duration === 0 && internalTime !== 0) {
      setInternalTime(0);
    }
  }, [duration, internalTime]);

  const maxDuration = Number.isFinite(duration) && duration > 0 ? duration : 1;

  const isDisabled =
    !(isEngineInitialized && Number.isFinite(duration)) ||
    duration <= 0 ||
    playbackState === PlaybackState.IDLE ||
    playbackState === PlaybackState.LOADING ||
    playbackState === PlaybackState.ERROR ||
    error !== null;

  let displayTime = 0;
  if (Number.isFinite(internalTime)) {
    displayTime = isDragging ? internalTime : currentTime;
  }

  const handleValueChange = (value: number | readonly number[]) => {
    const newTime = Array.isArray(value) ? value[0] : value;
    if (newTime !== undefined) {
      setInternalTime(newTime);
      if (!isDragging) {
        setIsDragging(true);
      }
      if (isDragging && isEngineInitialized) {
        seek(newTime);
      }
    }
  };

  const handlePointerDown = () => {
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  return (
    <Slider
      {...otherProps}
      className={cn(
        "group/player relative flex h-4 touch-none select-none items-center data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col data-disabled:opacity-50",
        otherProps.className
      )}
      data-state={isDisabled || maxDuration === 0 ? "disabled" : "enabled"}
      disabled={isDisabled || maxDuration === 0}
      max={maxDuration}
      min={0}
      onPointerDown={handlePointerDown}
      onValueChange={handleValueChange}
      onValueCommitted={(value) => {
        const seekTime = Array.isArray(value) ? value[0] : value;
        if (isDragging && isEngineInitialized && seekTime !== undefined) {
          seek(seekTime);
        }
        setIsDragging(false);
      }}
      step={otherProps.step || 0.1}
      value={[displayTime]}
    />
  );
}

function PlayerTime({ className, ...otherProps }: HTMLProps<HTMLTimeElement>) {
  const audio = useAudio();
  const currentTime = audio.state.playback.currentTime;
  const formattedTime = formatDuration(currentTime);
  const isoTime = formatSecondsToISO8601(currentTime);

  return (
    <time
      {...otherProps}
      className={cn(
        "shrink-0 font-mono text-muted-foreground text-sm tabular-nums",
        className
      )}
      dateTime={isoTime}
    >
      {formattedTime}
    </time>
  );
}

function PlayerDuration({
  className,
  ...otherProps
}: HTMLProps<HTMLTimeElement>) {
  const audio = useAudio();
  const duration = audio.state.playback.duration;
  const hasValidDuration =
    duration !== null &&
    duration !== undefined &&
    duration > 0 &&
    !Number.isNaN(duration);

  const formattedDuration = hasValidDuration
    ? formatDuration(duration)
    : "--:--";
  const isoDuration = hasValidDuration
    ? formatSecondsToISO8601(duration)
    : undefined;

  return (
    <time
      {...otherProps}
      className={cn(
        "shrink-0 font-mono text-muted-foreground text-sm tabular-nums",
        className
      )}
      dateTime={isoDuration}
    >
      {formattedDuration}
    </time>
  );
}

// ============================================================================
// Data - Example Tracks
// ============================================================================

const exampleTracks: QueueItem<{ name: string }>[] = [
  {
    id: "0",
    title: "II - 00",
    url: "https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/00.mp3",
    data: { name: "II - 00" },
  },
  {
    id: "1",
    title: "II - 01",
    url: "https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/01.mp3",
    data: { name: "II - 01" },
  },
  {
    id: "2",
    title: "II - 02",
    url: "https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/02.mp3",
    data: { name: "II - 02" },
  },
  {
    id: "3",
    title: "II - 03",
    url: "https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/03.mp3",
    data: { name: "II - 03" },
  },
  {
    id: "4",
    title: "II - 04",
    url: "https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/04.mp3",
    data: { name: "II - 04" },
  },
  {
    id: "5",
    title: "II - 05",
    url: "https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/05.mp3",
    data: { name: "II - 05" },
  },
  {
    id: "6",
    title: "II - 06",
    url: "https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/06.mp3",
    data: { name: "II - 06" },
  },
  {
    id: "7",
    title: "II - 07",
    url: "https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/07.mp3",
    data: { name: "II - 07" },
  },
  {
    id: "8",
    title: "II - 08",
    url: "https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/08.mp3",
    data: { name: "II - 08" },
  },
  {
    id: "9",
    title: "II - 09",
    url: "https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/09.mp3",
    data: { name: "II - 09" },
  },
];

// ============================================================================
// Exports
// ============================================================================

// Re-export AudioProvider as AudioPlayerProvider for backward compatibility
// Re-export hooks for backward compatibility
export {
  AudioProvider as AudioPlayerProvider,
  useAudio as useAudioPlayer,
} from "audio-engine/react";

export {
  Player,
  PlayPauseButton,
  PreviousButton,
  NextButton,
  SkipBackwardButton,
  SkipForwardButton,
  PlayerSpeed,
  PlayerSpeedButtonGroup,
  PlayerVolume,
  PlayerProgress,
  PlayerTime,
  PlayerDuration,
  PlayerTrackInfo,
  PlayerFileInput,
  exampleTracks,
};
