"use client";

import { mergeProps } from "@base-ui-components/react/merge-props";
import { useRender } from "@base-ui-components/react/use-render";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type WaveformProps = useRender.ComponentProps<"div"> & {
  data?: number[];
  barWidth?: number;
  barGap?: number;
  barRadius?: number;
  barColor?: string;
  fadeEdges?: boolean;
  fadeWidth?: number;
  height?: string | number;
  active?: boolean;
  onBarClick?: (index: number, value: number) => void;
};

const Waveform = ({
  data = [],
  barWidth = 4,
  barGap = 2,
  barRadius = 2,
  barColor,
  fadeEdges = true,
  fadeWidth = 24,
  height = 128,
  onBarClick,
  className,
  render,
  ...props
}: WaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const heightStyle = typeof height === "number" ? `${height}px` : height;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!(canvas && container)) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
        renderWaveform();
      }
    });

    const drawBars = (
      ctx: CanvasRenderingContext2D,
      rect: DOMRect,
      computedBarColor: string
    ) => {
      const barCount = Math.floor(rect.width / (barWidth + barGap));
      const centerY = rect.height / 2;

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * data.length);
        const value = data[dataIndex] || 0;
        const barHeight = Math.max(4, value * rect.height * 0.8);
        const x = i * (barWidth + barGap);
        const y = centerY - barHeight / 2;

        ctx.fillStyle = computedBarColor;
        ctx.globalAlpha = 0.3 + value * 0.7;

        if (barRadius > 0) {
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, barRadius);
          ctx.fill();
        } else {
          ctx.fillRect(x, y, barWidth, barHeight);
        }
      }
    };

    const applyFadeEdges = (ctx: CanvasRenderingContext2D, rect: DOMRect) => {
      if (!(fadeEdges && fadeWidth > 0 && rect.width > 0)) {
        return;
      }

      const gradient = ctx.createLinearGradient(0, 0, rect.width, 0);
      const fadePercent = Math.min(0.2, fadeWidth / rect.width);

      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(fadePercent, "rgba(255,255,255,0)");
      gradient.addColorStop(1 - fadePercent, "rgba(255,255,255,0)");
      gradient.addColorStop(1, "rgba(255,255,255,1)");

      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.globalCompositeOperation = "source-over";
    };

    const renderWaveform = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const computedBarColor =
        barColor ||
        getComputedStyle(canvas).getPropertyValue("--foreground") ||
        "#000";

      drawBars(ctx, rect, computedBarColor);
      applyFadeEdges(ctx, rect);
      ctx.globalAlpha = 1;
    };

    resizeObserver.observe(container);
    renderWaveform();

    return () => resizeObserver.disconnect();
  }, [data, barWidth, barGap, barRadius, barColor, fadeEdges, fadeWidth]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onBarClick) {
      return;
    }

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    const x = e.clientX - rect.left;
    const barIndex = Math.floor(x / (barWidth + barGap));
    const dataIndex = Math.floor(
      (barIndex * data.length) / Math.floor(rect.width / (barWidth + barGap))
    );

    if (dataIndex >= 0 && dataIndex < data.length) {
      onBarClick?.(dataIndex, data[dataIndex] ?? 0);
    }
  };

  const defaultProps = {
    "data-slot": "waveform",
    className: cn("relative", className),
    style: { height: heightStyle },
    children: (
      <canvas
        className="block h-full w-full"
        onClick={handleClick}
        ref={canvasRef}
      />
    ),
  };

  return useRender({
    defaultTagName: "div",
    render,
    ref: containerRef,
    props: mergeProps<"div">(defaultProps, props),
  });
};

type ScrollingWaveformProps = Omit<WaveformProps, "data" | "onBarClick"> & {
  speed?: number;
  barCount?: number;
  data?: number[];
};

const ScrollingWaveform = ({
  speed = 50,
  barCount = 60,
  barWidth = 4,
  barGap = 2,
  barRadius = 2,
  barColor,
  fadeEdges = true,
  fadeWidth = 24,
  height = 128,
  data,
  className,
  render,
  ...props
}: ScrollingWaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<Array<{ x: number; height: number }>>([]);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const seedRef = useRef(Math.random());
  const dataIndexRef = useRef(0);
  const heightStyle = typeof height === "number" ? `${height}px` : height;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!(canvas && container)) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      if (barsRef.current.length === 0) {
        const step = barWidth + barGap;
        let currentX = rect.width;
        let index = 0;
        const seededRandom = (i: number) => {
          const x = Math.sin(seedRef.current * 10_000 + i) * 10_000;
          return x - Math.floor(x);
        };
        while (currentX > -step) {
          barsRef.current.push({
            x: currentX,
            height: 0.2 + seededRandom(index++) * 0.6,
          });
          currentX -= step;
        }
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [barWidth, barGap]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const updateBarsPosition = (deltaTime: number) => {
      for (const bar of barsRef.current) {
        bar.x -= speed * deltaTime;
      }
    };

    const filterOffscreenBars = (step: number) => {
      barsRef.current = barsRef.current.filter(
        (bar) => bar.x + barWidth > -step
      );
    };

    const calculateNewBarHeight = (): number => {
      if (data && data.length > 0) {
        const barHeightValue = data[dataIndexRef.current % data.length] || 0.1;
        dataIndexRef.current = (dataIndexRef.current + 1) % data.length;
        return barHeightValue;
      }

      const time = Date.now() / 1000;
      const uniqueIndex = barsRef.current.length + time * 0.01;
      const seededRandom = (index: number) => {
        const x = Math.sin(seedRef.current * 10_000 + index * 137.5) * 10_000;
        return x - Math.floor(x);
      };
      const wave1 = Math.sin(uniqueIndex * 0.1) * 0.2;
      const wave2 = Math.cos(uniqueIndex * 0.05) * 0.15;
      const randomComponent = seededRandom(uniqueIndex) * 0.4;
      return Math.max(
        0.1,
        Math.min(0.9, 0.3 + wave1 + wave2 + randomComponent)
      );
    };

    const generateNewBars = (rect: DOMRect, step: number) => {
      while (
        barsRef.current.length === 0 ||
        (barsRef.current.at(-1)?.x ?? 0) < rect.width
      ) {
        const lastBar = barsRef.current.at(-1);
        const nextX = lastBar ? lastBar.x + step : rect.width;
        const newHeight = calculateNewBarHeight();

        barsRef.current.push({
          x: nextX,
          height: newHeight,
        });
        if (barsRef.current.length > barCount * 2) {
          break;
        }
      }
    };

    const drawBars = (
      context: CanvasRenderingContext2D,
      bounds: DOMRect,
      computedBarColor: string
    ) => {
      const centerY = bounds.height / 2;
      for (const bar of barsRef.current) {
        if (bar.x < bounds.width && bar.x + barWidth > 0) {
          const barHeight = Math.max(4, bar.height * bounds.height * 0.6);
          const y = centerY - barHeight / 2;

          context.fillStyle = computedBarColor;
          context.globalAlpha = 0.3 + bar.height * 0.7;

          if (barRadius > 0) {
            context.beginPath();
            context.roundRect(bar.x, y, barWidth, barHeight, barRadius);
            context.fill();
          } else {
            context.fillRect(bar.x, y, barWidth, barHeight);
          }
        }
      }
    };

    const applyFadeEdges = (
      context: CanvasRenderingContext2D,
      bounds: DOMRect
    ) => {
      if (!(fadeEdges && fadeWidth > 0)) {
        return;
      }

      const gradient = context.createLinearGradient(0, 0, bounds.width, 0);
      const fadePercent = Math.min(0.2, fadeWidth / bounds.width);

      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(fadePercent, "rgba(255,255,255,0)");
      gradient.addColorStop(1 - fadePercent, "rgba(255,255,255,0)");
      gradient.addColorStop(1, "rgba(255,255,255,1)");

      context.globalCompositeOperation = "destination-out";
      context.fillStyle = gradient;
      context.fillRect(0, 0, bounds.width, bounds.height);
      context.globalCompositeOperation = "source-over";
    };

    const animate = (currentTime: number) => {
      const deltaTime = lastTimeRef.current
        ? (currentTime - lastTimeRef.current) / 1000
        : 0;
      lastTimeRef.current = currentTime;

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const computedBarColor =
        barColor ||
        getComputedStyle(canvas).getPropertyValue("--foreground") ||
        "#000";

      const step = barWidth + barGap;
      updateBarsPosition(deltaTime);
      filterOffscreenBars(step);
      generateNewBars(rect, step);
      drawBars(ctx, rect, computedBarColor);
      applyFadeEdges(ctx, rect);

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    speed,
    barCount,
    barWidth,
    barGap,
    barRadius,
    barColor,
    fadeEdges,
    fadeWidth,
    data,
  ]);

  const defaultProps = {
    "data-slot": "scrolling-waveform",
    className: cn("relative flex items-center", className),
    style: { height: heightStyle },
    children: <canvas className="block h-full w-full" ref={canvasRef} />,
  };

  return useRender({
    defaultTagName: "div",
    render,
    ref: containerRef,
    props: mergeProps<"div">(defaultProps, props),
  });
};

type AudioScrubberProps = WaveformProps & {
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  showHandle?: boolean;
};

const AudioScrubber = ({
  data = [],
  currentTime = 0,
  duration = 100,
  onSeek,
  showHandle = true,
  barWidth = 3,
  barGap = 1,
  barRadius = 1,
  barColor,
  height = 128,
  className,
  render,
  ...props
}: AudioScrubberProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [localProgress, setLocalProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const waveformData =
    data.length > 0
      ? data
      : Array.from({ length: 100 }, () => 0.2 + Math.random() * 0.6);

  useEffect(() => {
    if (!isDragging && duration > 0) {
      setLocalProgress(currentTime / duration);
    }
  }, [currentTime, duration, isDragging]);

  const handleScrub = useCallback(
    (clientX: number) => {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      const rect = container.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const progress = x / rect.width;
      const newTime = progress * duration;

      setLocalProgress(progress);
      onSeek?.(newTime);
    },
    [duration, onSeek]
  );

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    handleScrub(e.clientX);
  };

  useEffect(() => {
    if (!isDragging) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      handleScrub(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleScrub]);

  const heightStyle = typeof height === "number" ? `${height}px` : height;

  const defaultProps = {
    "data-slot": "audio-scrubber",
    "aria-label": "Audio waveform scrubber",
    "aria-valuemax": duration,
    "aria-valuemin": 0,
    "aria-valuenow": currentTime,
    className: cn("relative cursor-pointer select-none", className),
    onMouseDown: handleMouseDown,
    role: "slider",
    style: { height: heightStyle },
    tabIndex: 0,
    children: (
      <>
        <Waveform
          barColor={barColor}
          barGap={barGap}
          barRadius={barRadius}
          barWidth={barWidth}
          data={waveformData}
          fadeEdges={false}
        />

        <div
          className="pointer-events-none absolute inset-y-0 left-0 bg-primary/20"
          style={{ width: `${localProgress * 100}%` }}
        />

        <div
          className="pointer-events-none absolute top-0 bottom-0 w-0.5 bg-primary"
          style={{ left: `${localProgress * 100}%` }}
        />

        {showHandle && (
          <div
            className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-1/2 h-4 w-4 rounded-full border-2 border-background bg-primary shadow-lg transition-transform hover:scale-110"
            style={{ left: `${localProgress * 100}%` }}
          />
        )}
      </>
    ),
  };

  return useRender({
    defaultTagName: "div",
    render,
    ref: containerRef,
    props: mergeProps<"div">(defaultProps, props),
  });
};

type MicrophoneWaveformProps = WaveformProps & {
  active?: boolean;
  processing?: boolean;
  fftSize?: number;
  smoothingTimeConstant?: number;
  sensitivity?: number;
  onError?: (error: Error) => void;
};

const MicrophoneWaveform = ({
  active = false,
  processing = false,
  fftSize = 256,
  smoothingTimeConstant = 0.8,
  sensitivity = 1,
  onError,
  ...props
}: MicrophoneWaveformProps) => {
  const [data, setData] = useState<number[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const processingAnimationRef = useRef<number | null>(null);
  const lastActiveDataRef = useRef<number[]>([]);
  const transitionProgressRef = useRef(0);

  useEffect(() => {
    if (processing && !active) {
      let time = 0;
      transitionProgressRef.current = 0;

      const animateProcessing = () => {
        time += 0.03;
        transitionProgressRef.current = Math.min(
          1,
          transitionProgressRef.current + 0.02
        );

        const processingData: number[] = [];
        const barCount = 45;

        for (let i = 0; i < barCount; i++) {
          const normalizedPosition = (i - barCount / 2) / (barCount / 2);
          const centerWeight = 1 - Math.abs(normalizedPosition) * 0.4;

          const wave1 = Math.sin(time * 1.5 + i * 0.15) * 0.25;
          const wave2 = Math.sin(time * 0.8 - i * 0.1) * 0.2;
          const wave3 = Math.cos(time * 2 + i * 0.05) * 0.15;
          const combinedWave = wave1 + wave2 + wave3;
          const processingValue = (0.2 + combinedWave) * centerWeight;

          let finalValue = processingValue;
          if (
            lastActiveDataRef.current.length > 0 &&
            transitionProgressRef.current < 1
          ) {
            const lastDataIndex = Math.floor(
              (i / barCount) * lastActiveDataRef.current.length
            );
            const lastValue = lastActiveDataRef.current[lastDataIndex] || 0;
            finalValue =
              lastValue * (1 - transitionProgressRef.current) +
              processingValue * transitionProgressRef.current;
          }

          processingData.push(Math.max(0.05, Math.min(1, finalValue)));
        }

        setData(processingData);
        processingAnimationRef.current =
          requestAnimationFrame(animateProcessing);
      };

      animateProcessing();

      return () => {
        if (processingAnimationRef.current) {
          cancelAnimationFrame(processingAnimationRef.current);
        }
      };
    }
    if (!(active || processing)) {
      if (data.length > 0) {
        let fadeProgress = 0;
        const fadeToIdle = () => {
          fadeProgress += 0.03;
          if (fadeProgress < 1) {
            const fadedData = data.map((value) => value * (1 - fadeProgress));
            setData(fadedData);
            requestAnimationFrame(fadeToIdle);
          } else {
            setData([]);
          }
        };
        fadeToIdle();
      }
      return;
    }
  }, [processing, active, data.length, data.map]);

  useEffect(() => {
    const cleanupAudioResources = () => {
      if (streamRef.current) {
        for (const track of streamRef.current.getTracks()) {
          track.stop();
        }
      }
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close();
      }
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };

    const normalizeAudioData = (
      relevantData: Uint8Array,
      sensitivityValue: number
    ): number[] => {
      const halfLength = Math.floor(relevantData.length / 2);
      const normalizedData: number[] = [];

      for (let i = halfLength - 1; i >= 0; i--) {
        const dataValue = relevantData[i];
        if (dataValue !== undefined) {
          const value = Math.min(1, (dataValue / 255) * sensitivityValue);
          normalizedData.push(value);
        }
      }

      for (let i = 0; i < halfLength; i++) {
        const dataValue = relevantData[i];
        if (dataValue !== undefined) {
          const value = Math.min(1, (dataValue / 255) * sensitivityValue);
          normalizedData.push(value);
        }
      }

      return normalizedData;
    };

    if (!active) {
      cleanupAudioResources();
      return;
    }

    const setupMicrophone = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        streamRef.current = stream;

        const audioContext = new (
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext
        )();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = fftSize;
        analyser.smoothingTimeConstant = smoothingTimeConstant;

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateData = () => {
          if (!(analyserRef.current && active)) {
            return;
          }

          analyserRef.current.getByteFrequencyData(dataArray);

          const startFreq = Math.floor(dataArray.length * 0.05);
          const endFreq = Math.floor(dataArray.length * 0.4);
          const relevantData = dataArray.slice(startFreq, endFreq);

          const normalizedData = normalizeAudioData(relevantData, sensitivity);

          setData(normalizedData);
          lastActiveDataRef.current = normalizedData;

          animationIdRef.current = requestAnimationFrame(updateData);
        };

        updateData();
      } catch (error) {
        onError?.(error as Error);
      }
    };

    setupMicrophone();

    return cleanupAudioResources;
  }, [active, fftSize, smoothingTimeConstant, sensitivity, onError]);

  return <Waveform data={data} {...props} />;
};

type StaticWaveformProps = WaveformProps & {
  bars?: number;
  seed?: number;
};

const StaticWaveform = ({
  bars = 40,
  seed = 42,
  ...props
}: StaticWaveformProps) => {
  const data = useMemo(() => {
    const random = (seedValue: number) => {
      const x = Math.sin(seedValue) * 10_000;
      return x - Math.floor(x);
    };

    return Array.from({ length: bars }, (_, i) => 0.2 + random(seed + i) * 0.6);
  }, [bars, seed]);

  return <Waveform data={data} {...props} />;
};

type LiveMicrophoneWaveformProps = Omit<ScrollingWaveformProps, "barCount"> & {
  active?: boolean;
  fftSize?: number;
  smoothingTimeConstant?: number;
  sensitivity?: number;
  onError?: (error: Error) => void;
  historySize?: number;
  updateRate?: number;
  savedHistoryRef?: React.RefObject<number[]>;
  dragOffset?: number;
  setDragOffset?: (offset: number) => void;
  enableAudioPlayback?: boolean;
  playbackRate?: number;
};

const calculateDataIndex = (
  i: number,
  dataLength: number,
  offsetInBars: number,
  isActive: boolean
): number | null => {
  let dataIndex: number;

  if (isActive) {
    dataIndex = dataLength - 1 - i;
  } else {
    dataIndex = Math.max(
      0,
      Math.min(dataLength - 1, dataLength - 1 - i - Math.floor(offsetInBars))
    );
  }

  if (dataIndex >= 0 && dataIndex < dataLength) {
    return dataIndex;
  }
  return null;
};

const drawSingleBar = (
  ctx: CanvasRenderingContext2D,
  config: {
    x: number;
    y: number;
    barHeight: number;
    barColor: string;
    alpha: number;
    barWidth: number;
    barRadius: number;
  }
) => {
  ctx.fillStyle = config.barColor;
  ctx.globalAlpha = config.alpha;

  if (config.barRadius > 0) {
    ctx.beginPath();
    ctx.roundRect(
      config.x,
      config.y,
      config.barWidth,
      config.barHeight,
      config.barRadius
    );
    ctx.fill();
  } else {
    ctx.fillRect(config.x, config.y, config.barWidth, config.barHeight);
  }
};

const drawBarsHelper = (
  ctx: CanvasRenderingContext2D,
  rect: DOMRect,
  computedBarColor: string,
  config: {
    dataToRender: number[];
    dragOffset: number;
    active: boolean;
    barWidth: number;
    barGap: number;
    barRadius: number;
  }
) => {
  const step = config.barWidth + config.barGap;
  const barCount = Math.floor(rect.width / step);
  const centerY = rect.height / 2;

  if (config.dataToRender.length === 0) {
    return;
  }

  const offsetInBars = Math.floor(config.dragOffset / step);

  for (let i = 0; i < barCount; i++) {
    const dataIndex = calculateDataIndex(
      i,
      config.dataToRender.length,
      offsetInBars,
      config.active
    );

    if (dataIndex === null) {
      continue;
    }

    const value = config.dataToRender[dataIndex];
    if (value !== undefined) {
      const x = rect.width - (i + 1) * step;
      const barHeight = Math.max(4, value * rect.height * 0.7);
      const y = centerY - barHeight / 2;

      drawSingleBar(ctx, {
        x,
        y,
        barHeight,
        barColor: computedBarColor,
        alpha: 0.3 + value * 0.7,
        barWidth: config.barWidth,
        barRadius: config.barRadius,
      });
    }
  }
};

const applyFadeEdgesHelper = (
  ctx: CanvasRenderingContext2D,
  rect: DOMRect,
  fadeEdges: boolean,
  fadeWidth: number
) => {
  if (!(fadeEdges && fadeWidth > 0)) {
    return;
  }

  const gradient = ctx.createLinearGradient(0, 0, rect.width, 0);
  const fadePercent = Math.min(0.2, fadeWidth / rect.width);

  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(fadePercent, "rgba(255,255,255,0)");
  gradient.addColorStop(1 - fadePercent, "rgba(255,255,255,0)");
  gradient.addColorStop(1, "rgba(255,255,255,1)");

  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, rect.width, rect.height);
  ctx.globalCompositeOperation = "source-over";
};

const updateAudioDataHelper = (
  currentTime: number,
  config: {
    lastUpdateRef: React.RefObject<number>;
    analyserRef: React.RefObject<AnalyserNode | null>;
    historyRef: React.RefObject<number[]>;
    sensitivity: number;
    updateRate: number;
    historySize: number;
  }
) => {
  if (currentTime - config.lastUpdateRef.current <= config.updateRate) {
    return;
  }

  config.lastUpdateRef.current = currentTime;

  if (!config.analyserRef.current) {
    return;
  }

  const dataArray = new Uint8Array(
    config.analyserRef.current.frequencyBinCount
  );
  config.analyserRef.current.getByteFrequencyData(dataArray);

  let sum = 0;
  for (const value of dataArray) {
    sum += value;
  }
  const average = (sum / dataArray.length / 255) * config.sensitivity;

  config.historyRef.current.push(Math.min(1, Math.max(0.05, average)));

  if (config.historyRef.current.length > config.historySize) {
    config.historyRef.current.shift();
  }
};

const playScrubSoundHelper = (
  position: number,
  direction: number,
  config: {
    enableAudioPlayback: boolean;
    audioBufferRef: React.RefObject<AudioBuffer | null>;
    audioContextRef: React.RefObject<AudioContext | null>;
    scrubSourceRef: React.RefObject<AudioBufferSourceNode | null>;
  }
) => {
  if (
    !(
      config.enableAudioPlayback &&
      config.audioBufferRef.current &&
      config.audioContextRef.current
    )
  ) {
    return;
  }

  if (config.scrubSourceRef.current) {
    try {
      config.scrubSourceRef.current.stop();
    } catch {
      //noop
    }
  }

  const source = config.audioContextRef.current.createBufferSource();
  source.buffer = config.audioBufferRef.current;

  const speed = Math.abs(direction);
  const scrubPlaybackRate =
    direction > 0
      ? Math.min(3, 1 + speed * 0.1)
      : Math.max(-3, -1 - speed * 0.1);

  source.playbackRate.value = scrubPlaybackRate;

  const filter = config.audioContextRef.current.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = Math.max(200, 2000 - speed * 100);

  source.connect(filter);
  filter.connect(config.audioContextRef.current.destination);

  const startTime = Math.max(
    0,
    Math.min(position, config.audioBufferRef.current.duration - 0.1)
  );
  source.start(0, startTime, 0.1);
  config.scrubSourceRef.current = source;
};

const playFromPositionHelper = (
  position: number,
  config: {
    enableAudioPlayback: boolean;
    playbackRate: number;
    audioBufferRef: React.RefObject<AudioBuffer | null>;
    audioContextRef: React.RefObject<AudioContext | null>;
    sourceNodeRef: React.RefObject<AudioBufferSourceNode | null>;
    playbackStartTimeRef: React.RefObject<number>;
    setPlaybackPosition: (position: number | null) => void;
  }
) => {
  if (
    !(
      config.enableAudioPlayback &&
      config.audioBufferRef.current &&
      config.audioContextRef.current
    )
  ) {
    return;
  }

  if (config.sourceNodeRef.current) {
    try {
      config.sourceNodeRef.current.stop();
    } catch {
      //noop
    }
  }

  const source = config.audioContextRef.current.createBufferSource();
  source.buffer = config.audioBufferRef.current;
  source.playbackRate.value = config.playbackRate;
  source.connect(config.audioContextRef.current.destination);

  const startTime = Math.max(
    0,
    Math.min(position, config.audioBufferRef.current.duration)
  );
  source.start(0, startTime);
  config.sourceNodeRef.current = source;

  config.playbackStartTimeRef.current =
    config.audioContextRef.current.currentTime - startTime;
  config.setPlaybackPosition(startTime);

  source.onended = () => {
    config.setPlaybackPosition(null);
  };
};

const stopAudioResources = (config: {
  mediaRecorderRef: React.RefObject<MediaRecorder | null>;
  streamRef: React.RefObject<MediaStream | null>;
}) => {
  if (
    config.mediaRecorderRef.current &&
    config.mediaRecorderRef.current.state !== "inactive"
  ) {
    config.mediaRecorderRef.current.stop();
  }
  if (config.streamRef.current) {
    for (const track of config.streamRef.current.getTracks()) {
      track.stop();
    }
  }
};

const createCleanupAudioResources =
  (config: {
    mediaRecorderRef: React.RefObject<MediaRecorder | null>;
    streamRef: React.RefObject<MediaStream | null>;
    sourceNodeRef: React.RefObject<AudioBufferSourceNode | null>;
    scrubSourceRef: React.RefObject<AudioBufferSourceNode | null>;
  }): (() => void) =>
  (): void => {
    stopAudioResources(config);
    if (config.sourceNodeRef.current) {
      config.sourceNodeRef.current.stop();
    }
    if (config.scrubSourceRef.current) {
      config.scrubSourceRef.current.stop();
    }
  };

const setupMicrophoneAudioHelper = async (config: {
  streamRef: React.RefObject<MediaStream | null>;
  audioContextRef: React.RefObject<AudioContext | null>;
  analyserRef: React.RefObject<AnalyserNode | null>;
  mediaRecorderRef: React.RefObject<MediaRecorder | null>;
  audioChunksRef: React.RefObject<Blob[]>;
  fftSize: number;
  smoothingTimeConstant: number;
  enableAudioPlayback: boolean;
  onError?: (error: Error) => void;
}) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    config.streamRef.current = stream;

    const audioContext = new (
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    )();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = config.fftSize;
    analyser.smoothingTimeConstant = config.smoothingTimeConstant;

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    config.audioContextRef.current = audioContext;
    config.analyserRef.current = analyser;

    if (config.enableAudioPlayback) {
      const mediaRecorder = new MediaRecorder(stream);
      config.mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          config.audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(100);
    }
  } catch (error) {
    config.onError?.(error as Error);
  }
};

const useMicrophoneAudio = (config: {
  active: boolean;
  streamRef: React.RefObject<MediaStream | null>;
  mediaRecorderRef: React.RefObject<MediaRecorder | null>;
  audioChunksRef: React.RefObject<Blob[]>;
  audioBufferRef: React.RefObject<AudioBuffer | null>;
  sourceNodeRef: React.RefObject<AudioBufferSourceNode | null>;
  scrubSourceRef: React.RefObject<AudioBufferSourceNode | null>;
  historyRef: React.RefObject<number[]>;
  audioContextRef: React.RefObject<AudioContext | null>;
  analyserRef: React.RefObject<AnalyserNode | null>;
  enableAudioPlayback: boolean;
  processAudioBlob: (blob: Blob) => Promise<void>;
  setDragOffset?: (value: number) => void;
  setPlaybackPosition: (position: number | null) => void;
  fftSize: number;
  smoothingTimeConstant: number;
  onError?: (error: Error) => void;
}) => {
  useEffect(() => {
    if (!config.active) {
      stopAudioResources({
        mediaRecorderRef: config.mediaRecorderRef,
        streamRef: config.streamRef,
      });

      if (
        config.enableAudioPlayback &&
        config.audioChunksRef.current.length > 0
      ) {
        const audioBlob = new Blob(config.audioChunksRef.current, {
          type: "audio/webm",
        });
        config.processAudioBlob(audioBlob);
      }

      return createCleanupAudioResources({
        mediaRecorderRef: config.mediaRecorderRef,
        streamRef: config.streamRef,
        sourceNodeRef: config.sourceNodeRef,
        scrubSourceRef: config.scrubSourceRef,
      });
    }

    config.setDragOffset?.(0);
    config.historyRef.current = [];
    config.audioChunksRef.current = [];
    config.audioBufferRef.current = null;
    config.setPlaybackPosition(null);

    setupMicrophoneAudioHelper({
      streamRef: config.streamRef,
      audioContextRef: config.audioContextRef,
      analyserRef: config.analyserRef,
      mediaRecorderRef: config.mediaRecorderRef,
      audioChunksRef: config.audioChunksRef,
      fftSize: config.fftSize,
      smoothingTimeConstant: config.smoothingTimeConstant,
      enableAudioPlayback: config.enableAudioPlayback,
      onError: config.onError,
    });

    return createCleanupAudioResources({
      mediaRecorderRef: config.mediaRecorderRef,
      streamRef: config.streamRef,
      sourceNodeRef: config.sourceNodeRef,
      scrubSourceRef: config.scrubSourceRef,
    });
  }, [
    config.active,
    config.setDragOffset,
    config.enableAudioPlayback,
    config.historyRef,
    config.processAudioBlob,
    config.fftSize,
    config.smoothingTimeConstant,
    config.onError,
    config.analyserRef,
    config.audioChunksRef,
    config.audioBufferRef,
    config.audioContextRef,
    config.mediaRecorderRef,
    config.scrubSourceRef,
    config.setPlaybackPosition,
    config.sourceNodeRef,
    config.streamRef,
  ]);
};

const usePlaybackVisual = (config: {
  playbackPosition: number | null;
  playbackRate: number;
  audioContextRef: React.RefObject<AudioContext | null>;
  sourceNodeRef: React.RefObject<AudioBufferSourceNode | null>;
  audioBufferRef: React.RefObject<AudioBuffer | null>;
  playbackStartTimeRef: React.RefObject<number>;
  historyRef: React.RefObject<number[]>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  barWidth: number;
  barGap: number;
  setDragOffset?: (value: number) => void;
  setPlaybackPosition: (position: number | null) => void;
}) => {
  useEffect(() => {
    if (config.playbackPosition === null || !config.audioBufferRef.current) {
      return;
    }

    let animationId: number;
    const updatePlaybackVisual = () => {
      if (
        config.audioContextRef.current &&
        config.sourceNodeRef.current &&
        config.audioBufferRef.current
      ) {
        const elapsed =
          config.audioContextRef.current.currentTime -
          config.playbackStartTimeRef.current;
        const currentPos =
          (config.playbackPosition ?? 0) + elapsed * config.playbackRate;

        if (currentPos < config.audioBufferRef.current.duration) {
          const progressRatio =
            currentPos / config.audioBufferRef.current.duration;
          const currentBarIndex = Math.floor(
            progressRatio * config.historyRef.current.length
          );
          const step = config.barWidth + config.barGap;

          const containerWidth =
            config.containerRef.current?.getBoundingClientRect().width || 0;
          const viewBars = Math.floor(containerWidth / step);
          const targetOffset =
            -(currentBarIndex - (config.historyRef.current.length - viewBars)) *
            step;
          const clampedOffset = Math.max(
            -(config.historyRef.current.length - viewBars) * step,
            Math.min(0, targetOffset)
          );

          config.setDragOffset?.(clampedOffset);
          animationId = requestAnimationFrame(updatePlaybackVisual);
        } else {
          config.setPlaybackPosition(null);
          const step = config.barWidth + config.barGap;
          const containerWidth =
            config.containerRef.current?.getBoundingClientRect().width || 0;
          const viewBars = Math.floor(containerWidth / step);
          config.setDragOffset?.(
            -(config.historyRef.current.length - viewBars) * step
          );
        }
      }
    };

    animationId = requestAnimationFrame(updatePlaybackVisual);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [
    config.playbackPosition,
    config.playbackRate,
    config.barWidth,
    config.barGap,
    config.setDragOffset,
    config.setPlaybackPosition,
    config.historyRef,
    config.audioBufferRef,
    config.audioContextRef,
    config.sourceNodeRef,
    config.playbackStartTimeRef,
    config.containerRef,
  ]);
};

const useDragHandler = (config: {
  isDragging: boolean;
  setIsDragging: (value: boolean) => void;
  dragStartXRef: React.RefObject<number>;
  dragStartOffsetRef: React.RefObject<number>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  historyRef: React.RefObject<number[]>;
  audioBufferRef: React.RefObject<AudioBuffer | null>;
  scrubSourceRef: React.RefObject<AudioBufferSourceNode | null>;
  dragOffset: number;
  barWidth: number;
  barGap: number;
  enableAudioPlayback: boolean;
  setDragOffset?: (value: number) => void;
  playScrubSound: (position: number, direction: number) => void;
  playFromPosition: (position: number) => void;
}) => {
  useEffect(() => {
    if (!config.isDragging) {
      return;
    }

    let lastScrubTime = 0;
    let lastMouseX = config.dragStartXRef.current;
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - config.dragStartXRef.current;
      const newOffset = config.dragStartOffsetRef.current - deltaX * 0.5;

      const step = config.barWidth + config.barGap;
      const maxBars = config.historyRef.current.length;
      const viewWidth =
        config.canvasRef.current?.getBoundingClientRect().width || 0;
      const viewBars = Math.floor(viewWidth / step);

      const maxOffset = Math.max(0, (maxBars - viewBars) * step);
      const minOffset = 0;
      const clampedOffset = Math.max(minOffset, Math.min(maxOffset, newOffset));

      config.setDragOffset?.(clampedOffset);

      const now = Date.now();
      if (
        config.enableAudioPlayback &&
        config.audioBufferRef.current &&
        now - lastScrubTime > 50
      ) {
        lastScrubTime = now;
        const offsetBars = Math.floor(clampedOffset / step);
        const rightmostBarIndex = Math.max(
          0,
          Math.min(maxBars - 1, maxBars - 1 - offsetBars)
        );
        const audioPosition =
          (rightmostBarIndex / maxBars) *
          config.audioBufferRef.current.duration;
        const direction = e.clientX - lastMouseX;
        lastMouseX = e.clientX;
        config.playScrubSound(
          Math.max(
            0,
            Math.min(
              config.audioBufferRef.current.duration - 0.1,
              audioPosition
            )
          ),
          direction
        );
      }
    };

    const handleMouseUp = () => {
      config.setIsDragging(false);

      if (config.enableAudioPlayback && config.audioBufferRef.current) {
        const step = config.barWidth + config.barGap;
        const maxBars = config.historyRef.current.length;
        const offsetBars = Math.floor(config.dragOffset / step);
        const rightmostBarIndex = Math.max(
          0,
          Math.min(maxBars - 1, maxBars - 1 - offsetBars)
        );
        const audioPosition =
          (rightmostBarIndex / maxBars) *
          config.audioBufferRef.current.duration;
        config.playFromPosition(
          Math.max(
            0,
            Math.min(
              config.audioBufferRef.current.duration - 0.1,
              audioPosition
            )
          )
        );
      }

      if (config.scrubSourceRef.current) {
        try {
          config.scrubSourceRef.current.stop();
        } catch {
          //noop
        }
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    config.isDragging,
    config.setIsDragging,
    config.dragStartXRef,
    config.dragStartOffsetRef,
    config.canvasRef,
    config.historyRef,
    config.audioBufferRef,
    config.scrubSourceRef,
    config.dragOffset,
    config.barWidth,
    config.barGap,
    config.enableAudioPlayback,
    config.setDragOffset,
    config.playScrubSound,
    config.playFromPosition,
  ]);
};

const createCanvasAnimation = (
  canvas: HTMLCanvasElement,
  config: {
    active: boolean;
    historyRef: React.RefObject<number[]>;
    playbackPosition: number | null;
    dragOffset: number;
    barWidth: number;
    barGap: number;
    barRadius: number;
    barColor?: string;
    fadeEdges: boolean;
    fadeWidth: number;
    lastUpdateRef: React.RefObject<number>;
    analyserRef: React.RefObject<AnalyserNode | null>;
    sensitivity: number;
    updateRate: number;
    historySize: number;
    animationRef: React.RefObject<number>;
  }
): (() => void) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return () => {
      // No cleanup needed if context is not available
    };
  }

  const animate = (currentTime: number) => {
    if (config.active) {
      updateAudioDataHelper(currentTime, {
        lastUpdateRef: config.lastUpdateRef,
        analyserRef: config.analyserRef,
        historyRef: config.historyRef,
        sensitivity: config.sensitivity,
        updateRate: config.updateRate,
        historySize: config.historySize,
      });
    }

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    const computedBarColor =
      config.barColor ||
      getComputedStyle(canvas).getPropertyValue("--foreground") ||
      "#000";

    drawBarsHelper(ctx, rect, computedBarColor, {
      dataToRender: config.historyRef.current,
      dragOffset: config.dragOffset,
      active: config.active,
      barWidth: config.barWidth,
      barGap: config.barGap,
      barRadius: config.barRadius,
    });
    applyFadeEdgesHelper(ctx, rect, config.fadeEdges, config.fadeWidth);
    ctx.globalAlpha = 1;

    config.animationRef.current = requestAnimationFrame(animate);
  };

  if (
    config.active ||
    config.historyRef.current.length > 0 ||
    config.playbackPosition !== null
  ) {
    config.animationRef.current = requestAnimationFrame(animate);
  }

  return () => {
    if (config.animationRef.current) {
      cancelAnimationFrame(config.animationRef.current);
    }
  };
};

const LiveMicrophoneWaveform = ({
  active = false,
  fftSize = 256,
  smoothingTimeConstant = 0.8,
  sensitivity = 1,
  onError,
  historySize = 150,
  updateRate = 50,
  barWidth = 3,
  barGap = 1,
  barRadius = 1,
  barColor,
  fadeEdges = true,
  fadeWidth = 24,
  height = 128,
  className,
  savedHistoryRef,
  dragOffset: externalDragOffset,
  setDragOffset: externalSetDragOffset,
  enableAudioPlayback = true,
  playbackRate = 1,
  render,
  ...props
}: LiveMicrophoneWaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const internalHistoryRef = useRef<number[]>([]);
  const historyRef = savedHistoryRef || internalHistoryRef;
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);
  const [internalDragOffset, setInternalDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState<number | null>(null);
  const dragStartXRef = useRef<number>(0);
  const dragStartOffsetRef = useRef<number>(0);
  const playbackStartTimeRef = useRef<number>(0);

  // Audio recording and playback refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const scrubSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Use external drag state if provided, otherwise use internal
  const dragOffset = externalDragOffset ?? internalDragOffset;
  const setDragOffset = externalSetDragOffset ?? setInternalDragOffset;

  const heightStyle = typeof height === "number" ? `${height}px` : height;

  const isInteractive = !active && historyRef.current.length > 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!(canvas && container)) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  const processAudioBlob = useCallback(async (blob: Blob) => {
    try {
      const arrayBuffer = await blob.arrayBuffer();
      if (audioContextRef.current) {
        const audioBuffer =
          await audioContextRef.current.decodeAudioData(arrayBuffer);
        audioBufferRef.current = audioBuffer;
      }
    } catch (error) {
      console.error("Error processing audio:", error);
    }
  }, []);

  useMicrophoneAudio({
    active,
    streamRef,
    mediaRecorderRef,
    audioChunksRef,
    audioBufferRef,
    sourceNodeRef,
    scrubSourceRef,
    historyRef,
    audioContextRef,
    analyserRef,
    enableAudioPlayback,
    processAudioBlob,
    setDragOffset,
    setPlaybackPosition,
    fftSize,
    smoothingTimeConstant,
    onError,
  });

  const playScrubSound = useCallback(
    (position: number, direction: number) => {
      playScrubSoundHelper(position, direction, {
        enableAudioPlayback,
        audioBufferRef,
        audioContextRef,
        scrubSourceRef,
      });
    },
    [enableAudioPlayback]
  );

  const playFromPosition = useCallback(
    (position: number) => {
      playFromPositionHelper(position, {
        enableAudioPlayback,
        playbackRate,
        audioBufferRef,
        audioContextRef,
        sourceNodeRef,
        playbackStartTimeRef,
        setPlaybackPosition,
      });
    },
    [enableAudioPlayback, playbackRate]
  );

  usePlaybackVisual({
    playbackPosition,
    playbackRate,
    audioContextRef,
    sourceNodeRef,
    audioBufferRef,
    playbackStartTimeRef,
    historyRef,
    containerRef,
    barWidth,
    barGap,
    setDragOffset,
    setPlaybackPosition,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    if (
      !active &&
      historyRef.current.length === 0 &&
      playbackPosition === null
    ) {
      return;
    }

    return createCanvasAnimation(canvas, {
      active,
      historyRef,
      playbackPosition,
      dragOffset,
      barWidth,
      barGap,
      barRadius,
      barColor,
      fadeEdges,
      fadeWidth,
      lastUpdateRef,
      analyserRef,
      sensitivity,
      updateRate,
      historySize,
      animationRef,
    });
  }, [
    active,
    sensitivity,
    updateRate,
    historySize,
    barWidth,
    barGap,
    barRadius,
    barColor,
    fadeEdges,
    fadeWidth,
    dragOffset,
    playbackPosition,
    historyRef,
  ]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (active || historyRef.current.length === 0) {
      return;
    }

    e.preventDefault();
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = dragOffset;
  };

  useDragHandler({
    isDragging,
    setIsDragging,
    dragStartXRef,
    dragStartOffsetRef,
    canvasRef,
    historyRef,
    audioBufferRef,
    scrubSourceRef,
    dragOffset,
    barWidth,
    barGap,
    enableAudioPlayback,
    setDragOffset,
    playScrubSound,
    playFromPosition,
  });

  const defaultProps = {
    "data-slot": "live-microphone-waveform",
    "aria-label": isInteractive ? "Drag to scrub through recording" : undefined,
    "aria-valuemax": isInteractive ? historyRef.current.length : undefined,
    "aria-valuemin": isInteractive ? 0 : undefined,
    "aria-valuenow": isInteractive ? Math.abs(dragOffset) : undefined,
    className: cn(
      "relative flex items-center",
      isInteractive && "cursor-pointer",
      className
    ),
    onMouseDown: handleMouseDown,
    role: isInteractive ? "slider" : undefined,
    style: { height: heightStyle },
    tabIndex: isInteractive ? 0 : undefined,
    children: <canvas className="block h-full w-full" ref={canvasRef} />,
  };

  return useRender({
    defaultTagName: "div",
    render,
    ref: containerRef,
    props: mergeProps<"div">(defaultProps, props),
  });
};

type RecordingWaveformProps = Omit<WaveformProps, "data" | "onBarClick"> & {
  recording?: boolean;
  fftSize?: number;
  smoothingTimeConstant?: number;
  sensitivity?: number;
  onError?: (error: Error) => void;
  onRecordingComplete?: (data: number[]) => void;
  updateRate?: number;
  showHandle?: boolean;
};

const RecordingWaveform = ({
  recording = false,
  fftSize = 256,
  smoothingTimeConstant = 0.8,
  sensitivity = 1,
  onError,
  onRecordingComplete,
  updateRate = 50,
  showHandle = true,
  barWidth = 3,
  barGap = 1,
  barRadius = 1,
  barColor,
  height = 128,
  className,
  render,
  ...props
}: RecordingWaveformProps) => {
  const [recordedData, setRecordedData] = useState<number[]>([]);
  const [viewPosition, setViewPosition] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isRecordingComplete, setIsRecordingComplete] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const recordingDataRef = useRef<number[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);

  const heightStyle = typeof height === "number" ? `${height}px` : height;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!(canvas && container)) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const cleanupAudioResources = () => {
      if (streamRef.current) {
        for (const track of streamRef.current.getTracks()) {
          track.stop();
        }
      }
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close();
      }
    };

    const finalizeRecording = () => {
      if (recordingDataRef.current.length > 0) {
        setRecordedData([...recordingDataRef.current]);
        setIsRecordingComplete(true);
        onRecordingComplete?.(recordingDataRef.current);
      }
    };

    const resetRecordingState = () => {
      setIsRecordingComplete(false);
      recordingDataRef.current = [];
      setRecordedData([]);
      setViewPosition(1);
    };

    const setupMicrophone = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        streamRef.current = stream;

        const audioContext = new (
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext
        )();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = fftSize;
        analyser.smoothingTimeConstant = smoothingTimeConstant;

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
      } catch (error) {
        onError?.(error as Error);
      }
    };

    if (!recording) {
      cleanupAudioResources();
      finalizeRecording();
      return;
    }

    resetRecordingState();
    setupMicrophone();

    return cleanupAudioResources;
  }, [recording, fftSize, smoothingTimeConstant, onError, onRecordingComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const updateRecordingData = (currentTime: number) => {
      if (recording && currentTime - lastUpdateRef.current > updateRate) {
        lastUpdateRef.current = currentTime;

        if (analyserRef.current) {
          const dataArray = new Uint8Array(
            analyserRef.current.frequencyBinCount
          );
          analyserRef.current.getByteFrequencyData(dataArray);

          let sum = 0;
          for (const value of dataArray) {
            sum += value;
          }
          const average = (sum / dataArray.length / 255) * sensitivity;

          recordingDataRef.current.push(Math.min(1, Math.max(0.05, average)));
        }
      }
    };

    const calculateStartIndex = (
      dataLength: number,
      barsVisible: number
    ): number => {
      if (!recording && isRecordingComplete) {
        if (dataLength > barsVisible) {
          return Math.floor((dataLength - barsVisible) * viewPosition);
        }
        return 0;
      }
      if (recording) {
        return Math.max(0, dataLength - barsVisible);
      }
      return 0;
    };

    const drawBars = (
      context: CanvasRenderingContext2D,
      config: {
        rect: DOMRect;
        dataToRender: number[];
        startIndex: number;
        computedBarColor: string;
      }
    ) => {
      const step = barWidth + barGap;
      const barsVisible = Math.floor(config.rect.width / step);
      const centerY = config.rect.height / 2;

      for (
        let i = 0;
        i < barsVisible && config.startIndex + i < config.dataToRender.length;
        i++
      ) {
        const value = config.dataToRender[config.startIndex + i] || 0.1;
        const x = i * step;
        const barHeight = Math.max(4, value * config.rect.height * 0.7);
        const y = centerY - barHeight / 2;

        context.fillStyle = config.computedBarColor;
        context.globalAlpha = 0.3 + value * 0.7;

        if (barRadius > 0) {
          context.beginPath();
          context.roundRect(x, y, barWidth, barHeight, barRadius);
          context.fill();
        } else {
          context.fillRect(x, y, barWidth, barHeight);
        }
      }
    };

    const drawHandle = (
      context: CanvasRenderingContext2D,
      rect: DOMRect,
      computedBarColor: string
    ) => {
      if (!recording && isRecordingComplete && showHandle) {
        const indicatorX = rect.width * viewPosition;
        const centerY = rect.height / 2;

        context.strokeStyle = computedBarColor;
        context.globalAlpha = 0.5;
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(indicatorX, 0);
        context.lineTo(indicatorX, rect.height);
        context.stroke();
        context.fillStyle = computedBarColor;
        context.globalAlpha = 1;
        context.beginPath();
        context.arc(indicatorX, centerY, 6, 0, Math.PI * 2);
        context.fill();
      }
    };

    const animate = (currentTime: number) => {
      updateRecordingData(currentTime);

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const computedBarColor =
        barColor ||
        getComputedStyle(canvas).getPropertyValue("--foreground") ||
        "#000";

      const dataToRender = recording ? recordingDataRef.current : recordedData;

      if (dataToRender.length > 0) {
        const step = barWidth + barGap;
        const barsVisible = Math.floor(rect.width / step);
        const startIndex = calculateStartIndex(
          dataToRender.length,
          barsVisible
        );

        drawBars(ctx, {
          rect,
          dataToRender,
          startIndex,
          computedBarColor,
        });
        drawHandle(ctx, rect, computedBarColor);
      }

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    recording,
    recordedData,
    viewPosition,
    isRecordingComplete,
    sensitivity,
    updateRate,
    showHandle,
    barWidth,
    barGap,
    barRadius,
    barColor,
  ]);

  const handleScrub = useCallback(
    (clientX: number) => {
      const container = containerRef.current;
      if (!container || recording || !isRecordingComplete) {
        return;
      }

      const rect = container.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const position = x / rect.width;

      setViewPosition(position);
    },
    [recording, isRecordingComplete]
  );

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (recording || !isRecordingComplete) {
      return;
    }

    e.preventDefault();
    setIsDragging(true);
    handleScrub(e.clientX);
  };

  useEffect(() => {
    if (!isDragging) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      handleScrub(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleScrub]);

  const isInteractive = isRecordingComplete && !recording;

  const defaultProps = {
    "data-slot": "recording-waveform",
    "aria-label": isInteractive ? "Drag to scrub through recording" : undefined,
    "aria-valuemax": isInteractive ? 100 : undefined,
    "aria-valuemin": isInteractive ? 0 : undefined,
    "aria-valuenow": isInteractive ? viewPosition * 100 : undefined,
    className: cn(
      "relative flex items-center",
      isInteractive && "cursor-pointer",
      className
    ),
    onMouseDown: handleMouseDown,
    role: isInteractive ? "slider" : undefined,
    style: { height: heightStyle },
    tabIndex: isInteractive ? 0 : undefined,
    children: <canvas className="block h-full w-full" ref={canvasRef} />,
  };

  return useRender({
    defaultTagName: "div",
    render,
    ref: containerRef,
    props: mergeProps<"div">(defaultProps, props),
  });
};

export {
  Waveform,
  ScrollingWaveform,
  AudioScrubber,
  MicrophoneWaveform,
  StaticWaveform,
  LiveMicrophoneWaveform,
  RecordingWaveform,
};
