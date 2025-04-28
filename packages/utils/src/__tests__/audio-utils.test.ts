import { describe, expect, it, vi } from 'vitest';
import { drawVisualization, formatDuration, formatSecondsToISO8601 } from '../functions/audio-utils';

describe('audio-utils', () => {

  describe('formatDuration', () => {
    it('should format seconds correctly', () => {
      expect(formatDuration(0)).toBe('0:00');
      expect(formatDuration(5)).toBe('0:05');
      expect(formatDuration(59)).toBe('0:59');
      expect(formatDuration(60)).toBe('1:00');
      expect(formatDuration(65)).toBe('1:05');
      expect(formatDuration(125)).toBe('2:05');
      expect(formatDuration(3600)).toBe('60:00');
      expect(formatDuration(3661)).toBe('61:01');
    });

    it('should handle non-finite numbers', () => {
      expect(formatDuration(Number.POSITIVE_INFINITY)).toBe('0:00');
      expect(formatDuration(Number.NEGATIVE_INFINITY)).toBe('0:00');
      expect(formatDuration(Number.NaN)).toBe('0:00');
    });

    // Note: The function uses Math.floor, negative numbers effectively become 0:00
    it('should handle negative numbers gracefully', () => {
      expect(formatDuration(-10)).toBe('0:00');
    });
  });

  describe('formatSecondsToISO8601', () => {
    it('should format seconds to ISO 8601 duration format', () => {
      expect(formatSecondsToISO8601(0)).toBe('PT0S');
      expect(formatSecondsToISO8601(5)).toBe('PT5S');
      expect(formatSecondsToISO8601(59)).toBe('PT59S');
      expect(formatSecondsToISO8601(60)).toBe('PT1M0S');
      expect(formatSecondsToISO8601(65)).toBe('PT1M5S');
      expect(formatSecondsToISO8601(125)).toBe('PT2M5S');
      expect(formatSecondsToISO8601(3600)).toBe('PT1H0M0S');
      expect(formatSecondsToISO8601(3661)).toBe('PT1H1M1S');
      expect(formatSecondsToISO8601(3725)).toBe('PT1H2M5S');
      expect(formatSecondsToISO8601(7200)).toBe('PT2H0M0S');
      expect(formatSecondsToISO8601(7325)).toBe('PT2H2M5S');
    });

    it('should handle fractional seconds by flooring', () => {
      expect(formatSecondsToISO8601(65.7)).toBe('PT1M5S');
    });

    it('should handle non-finite or negative numbers', () => {
      expect(formatSecondsToISO8601(Number.POSITIVE_INFINITY)).toBe('PT0S');
      expect(formatSecondsToISO8601(Number.NEGATIVE_INFINITY)).toBe('PT0S');
      expect(formatSecondsToISO8601(Number.NaN)).toBe('PT0S');
      expect(formatSecondsToISO8601(-10)).toBe('PT0S');
    });
  });

  describe('drawVisualization', () => {
    it('should call canvas context methods correctly', () => {
      // Mock CanvasRenderingContext2D
      const mockCtx = {
        fillStyle: '',
        fillRect: vi.fn(),
        lineWidth: 0,
        strokeStyle: '',
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        stroke: vi.fn(),
        canvas: { width: 300, height: 150 }, // Mock canvas dimensions if needed
      } as unknown as CanvasRenderingContext2D; // Use unknown for type casting flexibility

      // Mock AnalyserNode
      const mockAnalyserNode = {
        frequencyBinCount: 128, // Example value
        getByteTimeDomainData: vi.fn(),
      } as unknown as AnalyserNode;

      const mockDataArray = new Uint8Array(128); // Match frequencyBinCount

      const width = 300;
      const height = 150;
      const backgroundColor = 'rgb(0, 0, 0)';
      const lineColor = 'rgb(255, 255, 255)';

      drawVisualization(
        mockCtx,
        mockAnalyserNode,
        mockDataArray,
        width,
        height,
        backgroundColor,
        lineColor
      );

      // Verify calls and property settings
      expect(mockAnalyserNode.getByteTimeDomainData).toHaveBeenCalledWith(mockDataArray);
      expect(mockCtx.fillStyle).toBe(backgroundColor);
      expect(mockCtx.fillRect).toHaveBeenCalledWith(0, 0, width, height);
      expect(mockCtx.lineWidth).toBe(2);
      expect(mockCtx.strokeStyle).toBe(lineColor);
      expect(mockCtx.beginPath).toHaveBeenCalledTimes(1);
      expect(mockCtx.moveTo).toHaveBeenCalledTimes(1); // Called once at the beginning
      // lineTo is called bufferLength - 1 times in the loop + 1 time after loop
      expect(mockCtx.lineTo).toHaveBeenCalledTimes(mockAnalyserNode.frequencyBinCount);
      expect(mockCtx.stroke).toHaveBeenCalledTimes(1);
    });

    it('should handle empty dataArray gracefully (though unlikely)', () => {
      const mockCtx = { fillStyle: '', fillRect: vi.fn(), lineWidth: 0, strokeStyle: '', beginPath: vi.fn(), moveTo: vi.fn(), lineTo: vi.fn(), stroke: vi.fn() } as any;
      const mockAnalyserNode = { frequencyBinCount: 0, getByteTimeDomainData: vi.fn() } as any; // frequencyBinCount is 0
      const mockDataArray = new Uint8Array(0); // Empty array
      const width = 100;
      const height = 50;
      const bgColor = 'black';
      const lnColor = 'white';

      drawVisualization(mockCtx, mockAnalyserNode, mockDataArray, width, height, bgColor, lnColor);

      expect(mockAnalyserNode.getByteTimeDomainData).toHaveBeenCalledWith(mockDataArray);
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