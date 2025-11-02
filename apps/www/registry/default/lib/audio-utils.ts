const AUDIO_CONSTANTS = Object.freeze({
  HOUR_IN_SECONDS: 3600,
  MINUTE_IN_SECONDS: 60,
  BYTE_MIDPOINT: 128,
  BYTE_MIDPOINT_DIVISOR: 128.0,
  VISUALIZATION_LINE_WIDTH: 2,
});

const formatDuration = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }
  const minutes = Math.floor(seconds / AUDIO_CONSTANTS.MINUTE_IN_SECONDS);
  const remainingSeconds = Math.floor(
    seconds % AUDIO_CONSTANTS.MINUTE_IN_SECONDS
  );
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

const formatSecondsToISO8601 = (seconds: number): string => {
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

export { AUDIO_CONSTANTS, formatDuration, formatSecondsToISO8601 };
