"use client";

import { drawVisualization } from "@audio-ui/utils";
import { PlaybackState, useAudioState } from "audio-engine/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type AudioVisualizerProps = React.ComponentProps<"canvas"> & {
  width?: number;
  height?: number;
  backgroundColor?: string;
  lineColor?: string;
};

function AudioVisualizer({
  className,
  width: initialWidth,
  height = 50,
  backgroundColor = "black",
  lineColor = "white",
  ...props
}: AudioVisualizerProps) {
  const { playbackState, analyserNode } = useAudioState();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const dataArray = useRef<Uint8Array<ArrayBuffer> | null>(null);
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
    if (!parentElement) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
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
    if (!(canvas && ctx) || currentWidth === 0 || height === 0) {
      return;
    }

    const updateCanvasDimensions = () => {
      if (canvas.width !== currentWidth) {
        canvas.width = currentWidth;
      }
      if (canvas.height !== height) {
        canvas.height = height;
      }
    };

    const drawIdleState = () => {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, currentWidth, height);
      ctx.fillStyle = lineColor;
      ctx.fillRect(0, Math.floor(height / 2) - 1, currentWidth, 2);
    };

    const drawPlayingState = () => {
      if (!analyserNode) {
        return;
      }
      if (!dataArray.current) {
        return;
      }
      drawVisualization(ctx, analyserNode, dataArray.current, {
        width: currentWidth,
        height,
        backgroundColor,
        lineColor,
      });
    };

    const performDraw = () => {
      const shouldDrawPlaying = isPlaying && analyserNode && dataArray.current;
      if (shouldDrawPlaying) {
        drawPlayingState();
        animationFrameId.current = requestAnimationFrame(performDraw);
      } else {
        drawIdleState();
      }
    };

    const initializeDataArray = () => {
      if (
        !dataArray.current ||
        dataArray.current.length !== analyserNode?.frequencyBinCount
      ) {
        dataArray.current = new Uint8Array(
          analyserNode?.frequencyBinCount ?? 0
        );
      }
    };

    const startAnimation = () => {
      if (animationFrameId.current === null) {
        animationFrameId.current = requestAnimationFrame(performDraw);
      }
    };

    const stopAnimation = () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };

    updateCanvasDimensions();

    if (isPlaying && analyserNode) {
      initializeDataArray();
      startAnimation();
    } else {
      stopAnimation();
      performDraw();
    }

    return stopAnimation;
  }, [
    isPlaying,
    analyserNode,
    currentWidth,
    height,
    backgroundColor,
    lineColor,
  ]);

  return (
    <canvas
      className={cn("rounded-lg border bg-card/50", className)}
      ref={canvasRef}
      {...props}
      data-state={isPlaying ? "playing" : "idle"}
      style={{
        width: "100%",
        height: `${height}px`,
        display: currentWidth === 0 ? "none" : "block",
        ...(props.style || {}),
      }}
    />
  );
}

export default AudioVisualizer;
