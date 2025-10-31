import {
  Field,
  FieldControl,
  FieldDescription,
  FieldLabel,
} from "@/registry/default/ui/field";

export default function FieldDemo() {
  return (
    <Field>
      <FieldLabel>Name</FieldLabel>
      <FieldControl placeholder="Enter your name" type="text" />
      <FieldDescription>Visible on your profile</FieldDescription>
    </Field>
  );
}
