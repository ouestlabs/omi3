import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/registry/default/ui/field";
import { Slider } from "@/registry/default/ui/slider";

export default function FieldSelectDemo() {
  return (
    <Field className="items-stretch gap-3">
      <FieldLabel>Country</FieldLabel>
      <Slider defaultValue={50} />
      <FieldDescription>This is an optional field</FieldDescription>
    </Field>
  );
}
