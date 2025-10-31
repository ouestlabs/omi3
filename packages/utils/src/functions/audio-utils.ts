import { AUDIO_CONSTANTS } from "../constants/audio";

export const formatDuration = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }
  const minutes = Math.floor(seconds / AUDIO_CONSTANTS.MINUTE_IN_SECONDS);
  const remainingSeconds = Math.floor(
    seconds % AUDIO_CONSTANTS.MINUTE_IN_SECONDS
  );
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

export const formatSecondsToISO8601 = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "PT0S";
  }

  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / AUDIO_CONSTANTS.HOUR_IN_SECONDS);
  const minutes = Math.floor(
    (totalSeconds % AUDIO_CONSTANTS.HOUR_IN_SECONDS) /
      AUDIO_CONSTANTS.MINUTE_IN_SECONDS
  );
  const secs = totalSeconds % AUDIO_CONSTANTS.MINUTE_IN_SECONDS;

  let durationString = "PT";
  if (hours > 0) {
    durationString += `${hours}H`;
  }
  if (minutes > 0 || hours > 0) {
    durationString += `${minutes}M`;
  }
  durationString += `${secs}S`;

  return durationString === "PT" ? "PT0S" : durationString;
};

type VisualizationConfig = {
  width: number;
  height: number;
  backgroundColor: string;
  lineColor: string;
};

export const drawVisualization = (
  ctx: CanvasRenderingContext2D,
  analyserNode: AnalyserNode,
  dataArray: Uint8Array<ArrayBuffer>,
  config: VisualizationConfig
) => {
  const { width, height, backgroundColor, lineColor } = config;
  analyserNode.getByteTimeDomainData(dataArray);

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  ctx.lineWidth = AUDIO_CONSTANTS.VISUALIZATION_LINE_WIDTH;
  ctx.strokeStyle = lineColor;
  ctx.beginPath();

  const bufferLength = analyserNode.frequencyBinCount;
  const sliceWidth = width / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const v =
      (dataArray[i] ?? AUDIO_CONSTANTS.BYTE_MIDPOINT) /
      AUDIO_CONSTANTS.BYTE_MIDPOINT_DIVISOR;
    const y = (v * height) / 2;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  ctx.lineTo(width, height / 2);
  ctx.stroke();
};
