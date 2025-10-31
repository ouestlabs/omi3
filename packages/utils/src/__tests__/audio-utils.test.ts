import { describe, expect, it, vi } from "bun:test";

import { AUDIO_CONSTANTS } from "../constants/audio";
import {
  drawVisualization,
  formatDuration,
  formatSecondsToISO8601,
} from "../functions/audio-utils";

const TEST_FREQUENCY_BIN_COUNT = 128;
const TEST_CANVAS_WIDTH = 300;
const TEST_CANVAS_HEIGHT = 150;
const TEST_SMALL_CANVAS_WIDTH = 100;
const TEST_SMALL_CANVAS_HEIGHT = 50;

const TEST_SECONDS_ZERO = 0;
const TEST_SECONDS_FIVE = 5;
const TEST_SECONDS_FIFTY_NINE = 59;
const TEST_SECONDS_SIXTY = 60;
const TEST_SECONDS_SIXTY_FIVE = 65;
const TEST_SECONDS_ONE_TWENTY_FIVE = 125;
const TEST_SECONDS_ONE_HOUR = 3600;
const TEST_SECONDS_ONE_HOUR_ONE_MINUTE_ONE = 3661;
const TEST_SECONDS_ONE_HOUR_TWO_MINUTES_FIVE = 3725;
const TEST_SECONDS_TWO_HOURS = 7200;
const TEST_SECONDS_TWO_HOURS_TWO_MINUTES_FIVE = 7325;
const TEST_SECONDS_SIXTY_FIVE_DOT_SEVEN = 65.7;
const TEST_SECONDS_NEGATIVE_TEN = -10;

describe("audio-utils", () => {
  describe("formatDuration", () => {
    it("should format seconds correctly", () => {
      expect(formatDuration(TEST_SECONDS_ZERO)).toBe("0:00");
      expect(formatDuration(TEST_SECONDS_FIVE)).toBe("0:05");
      expect(formatDuration(TEST_SECONDS_FIFTY_NINE)).toBe("0:59");
      expect(formatDuration(TEST_SECONDS_SIXTY)).toBe("1:00");
      expect(formatDuration(TEST_SECONDS_SIXTY_FIVE)).toBe("1:05");
      expect(formatDuration(TEST_SECONDS_ONE_TWENTY_FIVE)).toBe("2:05");
      expect(formatDuration(TEST_SECONDS_ONE_HOUR)).toBe("60:00");
      expect(formatDuration(TEST_SECONDS_ONE_HOUR_ONE_MINUTE_ONE)).toBe(
        "61:01"
      );
    });

    it("should handle non-finite numbers", () => {
      expect(formatDuration(Number.POSITIVE_INFINITY)).toBe("0:00");
      expect(formatDuration(Number.NEGATIVE_INFINITY)).toBe("0:00");
      expect(formatDuration(Number.NaN)).toBe("0:00");
    });

    // Note: The function uses Math.floor, negative numbers effectively become 0:00
    it("should handle negative numbers gracefully", () => {
      expect(formatDuration(TEST_SECONDS_NEGATIVE_TEN)).toBe("0:00");
    });
  });

  describe("formatSecondsToISO8601", () => {
    it("should format seconds to ISO 8601 duration format", () => {
      expect(formatSecondsToISO8601(TEST_SECONDS_ZERO)).toBe("PT0S");
      expect(formatSecondsToISO8601(TEST_SECONDS_FIVE)).toBe("PT5S");
      expect(formatSecondsToISO8601(TEST_SECONDS_FIFTY_NINE)).toBe("PT59S");
      expect(formatSecondsToISO8601(TEST_SECONDS_SIXTY)).toBe("PT1M0S");
      expect(formatSecondsToISO8601(TEST_SECONDS_SIXTY_FIVE)).toBe("PT1M5S");
      expect(formatSecondsToISO8601(TEST_SECONDS_ONE_TWENTY_FIVE)).toBe(
        "PT2M5S"
      );
      expect(formatSecondsToISO8601(TEST_SECONDS_ONE_HOUR)).toBe("PT1H0M0S");
      expect(formatSecondsToISO8601(TEST_SECONDS_ONE_HOUR_ONE_MINUTE_ONE)).toBe(
        "PT1H1M1S"
      );
      expect(
        formatSecondsToISO8601(TEST_SECONDS_ONE_HOUR_TWO_MINUTES_FIVE)
      ).toBe("PT1H2M5S");
      expect(formatSecondsToISO8601(TEST_SECONDS_TWO_HOURS)).toBe("PT2H0M0S");
      expect(
        formatSecondsToISO8601(TEST_SECONDS_TWO_HOURS_TWO_MINUTES_FIVE)
      ).toBe("PT2H2M5S");
    });

    it("should handle fractional seconds by flooring", () => {
      expect(formatSecondsToISO8601(TEST_SECONDS_SIXTY_FIVE_DOT_SEVEN)).toBe(
        "PT1M5S"
      );
    });

    it("should handle non-finite or negative numbers", () => {
      expect(formatSecondsToISO8601(Number.POSITIVE_INFINITY)).toBe("PT0S");
      expect(formatSecondsToISO8601(Number.NEGATIVE_INFINITY)).toBe("PT0S");
      expect(formatSecondsToISO8601(Number.NaN)).toBe("PT0S");
      expect(formatSecondsToISO8601(TEST_SECONDS_NEGATIVE_TEN)).toBe("PT0S");
    });
  });

  describe("drawVisualization", () => {
    it("should call canvas context methods correctly", () => {
      // Mock CanvasRenderingContext2D
      const mockCtx = {
        fillStyle: "",
        fillRect: vi.fn(),
        lineWidth: 0,
        strokeStyle: "",
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        stroke: vi.fn(),
        canvas: {
          width: TEST_CANVAS_WIDTH,
          height: TEST_CANVAS_HEIGHT,
        }, // Mock canvas dimensions if needed
      } as unknown as CanvasRenderingContext2D; // Use unknown for type casting flexibility

      // Mock AnalyserNode
      const mockAnalyserNode = {
        frequencyBinCount: TEST_FREQUENCY_BIN_COUNT, // Example value
        getByteTimeDomainData: vi.fn(),
      } as unknown as AnalyserNode;

      const mockDataArray = new Uint8Array(TEST_FREQUENCY_BIN_COUNT); // Match frequencyBinCount

      const width = TEST_CANVAS_WIDTH;
      const height = TEST_CANVAS_HEIGHT;
      const backgroundColor = "rgb(0, 0, 0)";
      const lineColor = "rgb(255, 255, 255)";

      drawVisualization(mockCtx, mockAnalyserNode, mockDataArray, {
        width,
        height,
        backgroundColor,
        lineColor,
      });

      // Verify calls and property settings
      expect(mockAnalyserNode.getByteTimeDomainData).toHaveBeenCalledWith(
        mockDataArray
      );
      expect(mockCtx.fillStyle).toBe(backgroundColor);
      expect(mockCtx.fillRect).toHaveBeenCalledWith(0, 0, width, height);
      expect(mockCtx.lineWidth).toBe(AUDIO_CONSTANTS.VISUALIZATION_LINE_WIDTH);
      expect(mockCtx.strokeStyle).toBe(lineColor);
      expect(mockCtx.beginPath).toHaveBeenCalledTimes(1);
      expect(mockCtx.moveTo).toHaveBeenCalledTimes(1); // Called once at the beginning
      // lineTo is called bufferLength - 1 times in the loop + 1 time after loop
      expect(mockCtx.lineTo).toHaveBeenCalledTimes(
        mockAnalyserNode.frequencyBinCount
      );
      expect(mockCtx.stroke).toHaveBeenCalledTimes(1);
    });

    it("should handle empty dataArray gracefully (though unlikely)", () => {
      const mockCtx = {
        fillStyle: "",
        fillRect: vi.fn(),
        lineWidth: 0,
        strokeStyle: "",
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        stroke: vi.fn(),
      } as any;
      const mockAnalyserNode = {
        frequencyBinCount: 0,
        getByteTimeDomainData: vi.fn(),
      } as any; // frequencyBinCount is 0
      const mockDataArray = new Uint8Array(0); // Empty array
      const width = TEST_SMALL_CANVAS_WIDTH;
      const height = TEST_SMALL_CANVAS_HEIGHT;
      const bgColor = "black";
      const lnColor = "white";

      drawVisualization(mockCtx, mockAnalyserNode, mockDataArray, {
        width,
        height,
        backgroundColor: bgColor,
        lineColor: lnColor,
      });

      expect(mockAnalyserNode.getByteTimeDomainData).toHaveBeenCalledWith(
        mockDataArray
      );
      expect(mockCtx.fillRect).toHaveBeenCalledWith(0, 0, width, height);
      expect(mockCtx.beginPath).toHaveBeenCalledTimes(1);
      expect(mockCtx.moveTo).not.toHaveBeenCalled(); // Loop shouldn't run
      // Only the final lineTo(width, height / 2) should be called
      expect(mockCtx.lineTo).toHaveBeenCalledTimes(1);
      expect(mockCtx.lineTo).toHaveBeenCalledWith(width, height / 2);
      expect(mockCtx.stroke).toHaveBeenCalledTimes(1);
    });
  });
});
