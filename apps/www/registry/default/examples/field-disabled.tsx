import {
  Field,
  FieldControl,
  FieldDescription,
  FieldLabel,
} from "@/registry/default/ui/field";

export default function FieldDisabledDemo() {
  return (
    <Field disabled>
      <FieldLabel>Email</FieldLabel>
      <FieldControl disabled placeholder="Enter your email" type="email" />
      <FieldDescription>This field is currently disabled.</FieldDescription>
    </Field>
  );
}
