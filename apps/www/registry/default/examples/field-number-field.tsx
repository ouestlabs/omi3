import { Field, FieldDescription } from "@/registry/default/ui/field";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea,
} from "@/registry/default/ui/number-field";

export default function FieldNumberFieldDemo() {
  return (
    <Field>
      <NumberField defaultValue={1} max={100} min={1}>
        <NumberFieldScrubArea label="Quantity" />
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
      <FieldDescription>Choose a value between 1 and 100.</FieldDescription>
    </Field>
  );
}
