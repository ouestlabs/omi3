export const formatDuration = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) { return "0:00"; }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

export const formatSecondsToISO8601 = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) { return "PT0S"; }

  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  let durationString = "PT";
  if (hours > 0) { durationString += `${hours}H`; }
  if (minutes > 0 || hours > 0) { durationString += `${minutes}M`; }
  durationString += `${secs}S`;

  return durationString === "PT" ? "PT0S" : durationString;
};

export const drawVisualization = (
  ctx: CanvasRenderingContext2D,
  analyserNode: AnalyserNode,
  dataArray: Uint8Array,
  width: number,
  height: number,
  backgroundColor: string,
  lineColor: string
) => {
  analyserNode.getByteTimeDomainData(dataArray);

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  ctx.lineWidth = 2;
  ctx.strokeStyle = lineColor;
  ctx.beginPath();

  const bufferLength = analyserNode.frequencyBinCount;
  const sliceWidth = width / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const v = (dataArray[i] ?? 128) / 128.0;
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
