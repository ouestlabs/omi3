"use client";

import {
  Meter,
  MeterIndicator,
  MeterLabel,
  MeterTrack,
  MeterValue,
} from "@/registry/default/ui/meter";

export default function MeterWithRangeDemo() {
  return (
    <Meter max={1000} min={500} value={700}>
      <div className="flex items-center justify-between gap-2">
        <MeterLabel>Bandwidth (Mbps)</MeterLabel>
        <MeterValue>{(_formatted, value) => value}</MeterValue>
      </div>
      <MeterTrack>
        <MeterIndicator />
      </MeterTrack>
    </Meter>
  );
}
