"use client";

import { Checkbox } from "@/registry/default/ui/checkbox";
import { CheckboxGroup } from "@/registry/default/ui/checkbox-group";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/registry/default/ui/field";
import { Fieldset, FieldsetLegend } from "@/registry/default/ui/fieldset";

export default function FieldCheckboxGroupDemo() {
  return (
    <Field
      className="gap-4"
      name="frameworks"
      render={(props) => <Fieldset {...props} />}
    >
      <FieldsetLegend className="font-medium text-sm">
        Frameworks
      </FieldsetLegend>
      <CheckboxGroup defaultValue={["react"]}>
        <FieldLabel>
          <Checkbox value="react" /> React
        </FieldLabel>
        <FieldLabel>
          <Checkbox value="vue" /> Vue
        </FieldLabel>
        <FieldLabel>
          <Checkbox value="svelte" /> Svelte
        </FieldLabel>
      </CheckboxGroup>
      <FieldDescription>Select one or more frameworks.</FieldDescription>
    </Field>
  );
}
