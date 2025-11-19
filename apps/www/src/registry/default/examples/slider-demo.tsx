"use client";

import { Slider } from "@/registry/default/ui/slider";

export default function SliderDemo() {
  return (
    <Slider
      bufferValue={75}
      className="w-[60%]"
      defaultValue={[25]}
      max={100}
      step={1}
    />
  );
}
