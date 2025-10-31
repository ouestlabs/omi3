"use client";

import * as React from "react";

import { Button } from "@/registry/default/ui/button";
import { Field, FieldLabel } from "@/registry/default/ui/field";
import { Fieldset, FieldsetLegend } from "@/registry/default/ui/fieldset";
import { Form } from "@/registry/default/ui/form";
import { Radio, RadioGroup } from "@/registry/default/ui/radio-group";

export default function RadioGroupFormDemo() {
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    alert(`Selected: ${formData.get("frameworks")}`);
  };

  return (
    <Form className="max-w-[160px]" onSubmit={onSubmit}>
      <Field
        className="gap-4"
        name="frameworks"
        render={(props) => <Fieldset {...props} />}
      >
        <FieldsetLegend className="font-medium text-sm">
          Frameworks
        </FieldsetLegend>
        <RadioGroup defaultValue="next">
          <FieldLabel>
            <Radio disabled={loading} value="next" /> Next.js
          </FieldLabel>
          <FieldLabel>
            <Radio disabled={loading} value="vite" /> Vite
          </FieldLabel>
          <FieldLabel>
            <Radio disabled={loading} value="astro" /> Astro
          </FieldLabel>
        </RadioGroup>
      </Field>
      <Button disabled={loading} type="submit">
        Submit
      </Button>
    </Form>
  );
}
