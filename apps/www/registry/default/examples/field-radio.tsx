"use client";

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/registry/default/ui/field";
import { Fieldset, FieldsetLegend } from "@/registry/default/ui/fieldset";
import { Radio, RadioGroup } from "@/registry/default/ui/radio-group";

export default function FieldRadioDemo() {
  return (
    <Field
      className="gap-4"
      name="plan"
      render={(props) => <Fieldset {...props} />}
    >
      <FieldsetLegend className="font-medium text-sm">
        Choose Plan
      </FieldsetLegend>
      <RadioGroup defaultValue="free">
        <FieldLabel>
          <Radio value="free" /> Free
        </FieldLabel>
        <FieldLabel>
          <Radio value="pro" /> Pro
        </FieldLabel>
        <FieldLabel>
          <Radio value="enterprise" /> Enterprise
        </FieldLabel>
      </RadioGroup>
      <FieldDescription>Select the plan that fits your needs.</FieldDescription>
    </Field>
  );
}
