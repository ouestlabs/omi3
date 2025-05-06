"use client";

import {
  PlaybackState,
  useAudioState
} from "@omi3/audio/react";
import { cn } from "@/lib/utils";
import { drawVisualization } from "@omi3/utils";
import { useEffect, useRef, useState } from "react";

type AudioVisualizerProps = React.ComponentProps<"canvas"> & {
  width?: number;
  height?: number;
  backgroundColor?: string;
  lineColor?: string;
};

export function AudioVisualizer({
  className,
  width: initialWidth,
  height = 50,
  backgroundColor = "oklch(14.67% 0.0041 49.31)",
  lineColor = "oklch(84.94% 0.2069 128.89)",
  ...props
}: AudioVisualizerProps) {
  const { playbackState, analyserNode } = useAudioState();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const dataArray = useRef<Uint8Array | null>(null);
  const [currentWidth, setCurrentWidth] = useState(initialWidth ?? 0);
  const isPlaying = playbackState === PlaybackState.PLAYING;

  useEffect(() => {
    if (!initialWidth && canvasRef.current?.parentElement) {
      setCurrentWidth(canvasRef.current.parentElement.clientWidth);
    } else if (initialWidth) {
      setCurrentWidth(initialWidth);
    }
  }, [initialWidth]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parentElement = canvas?.parentElement;
    if (!parentElement) { return; }

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        setCurrentWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(parentElement);

    return () => {
      if (parentElement) {
        resizeObserver.unobserve(parentElement);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || currentWidth === 0 || height === 0) {
      return;
    }

    if (canvas.width !== currentWidth) {
      canvas.width = currentWidth;
    }
    if (canvas.height !== height) {
      canvas.height = height;
    }

    const performDraw = () => {
      if (isPlaying && analyserNode && dataArray.current) {
        drawVisualization(ctx, analyserNode, dataArray.current, currentWidth, height, backgroundColor, lineColor);
        animationFrameId.current = requestAnimationFrame(performDraw);
      } else {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, currentWidth, height);
        ctx.fillStyle = lineColor;
        ctx.fillRect(0, Math.floor(height / 2) - 1, currentWidth, 2);
      }
    };

    if (isPlaying && analyserNode) {
      if (!dataArray.current || dataArray.current.length !== analyserNode.frequencyBinCount) {
        dataArray.current = new Uint8Array(analyserNode.frequencyBinCount);
      }
      if (animationFrameId.current === null) {
        animationFrameId.current = requestAnimationFrame(performDraw);
      }
    } else {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      performDraw();
    }

    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, [isPlaying, analyserNode, currentWidth, height, backgroundColor, lineColor]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("border rounded-lg bg-card/50", className)}
      {...props}
      style={{
        width: "100%",
        height: `${height}px`,
        display: currentWidth === 0 ? "none" : "block",
        ...(props.style || {}),
      }}
      data-state={isPlaying ? "playing" : "idle"}
    />
  );
}
