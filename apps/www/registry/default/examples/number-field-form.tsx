"use client";

import * as React from "react";
import { z } from "zod";

import { Button } from "@/registry/default/ui/button";
import { Field } from "@/registry/default/ui/field";
import { Form } from "@/registry/default/ui/form";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea,
} from "@/registry/default/ui/number-field";

const schema = z.object({
  quantity: z.coerce
    .number({ message: "Please enter a quantity." })
    .min(1, { message: "Quantity must be at least 1." })
    .max(100, { message: "Maximum quantity is 100." }),
});

type Errors = Record<string, string | string[]>;

async function submitForm(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const result = schema.safeParse(Object.fromEntries(formData as any));

  if (!result.success) {
    const { fieldErrors } = z.flattenError(result.error);
    return { errors: fieldErrors as Errors };
  }

  return {
    errors: {} as Errors,
    data: result.data,
  };
}

export default function NumberFieldFormDemo() {
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    const response = await submitForm(event);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    if (Object.keys(response.errors).length === 0) {
      alert(`Quantity: ${response.data?.quantity}`);
    }
  };

  return (
    <Form className="max-w-64" onSubmit={onSubmit}>
      <Field name="quantity">
        <NumberField defaultValue={1} disabled={loading} max={100} min={1}>
          <NumberFieldScrubArea label="Quantity" />
          <NumberFieldGroup>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldGroup>
        </NumberField>
      </Field>

      <Button disabled={loading} type="submit">
        Submit
      </Button>
    </Form>
  );
}
