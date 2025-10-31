import { Field, FieldLabel } from "@/registry/default/ui/field";
import { Switch } from "@/registry/default/ui/switch";

export default function FieldSwitchDemo() {
  return (
    <Field>
      <FieldLabel>
        <Switch />
        Email notifications
      </FieldLabel>
    </Field>
  );
}
