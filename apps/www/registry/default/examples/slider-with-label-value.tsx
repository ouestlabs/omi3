import { Label } from "@/registry/default/ui/label";
import { Slider, SliderValue } from "@/registry/default/ui/slider";

export default function SliderWithLabelValue() {
  return (
    <Slider defaultValue={50}>
      <div className="mb-2 flex items-center justify-between gap-1">
        <Label className="font-medium text-sm">Opacity</Label>
        <SliderValue />
      </div>
    </Slider>
  );
}
