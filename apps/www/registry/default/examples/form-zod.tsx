"use client";

import * as React from "react";
import { z } from "zod";

import { Button } from "@/registry/default/ui/button";
import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
} from "@/registry/default/ui/field";
import { Form } from "@/registry/default/ui/form";

const schema = z.object({
  name: z.string().min(1, { message: "Please enter a name." }),
  age: z.coerce
    .number({ message: "Please enter a number." })
    .positive({ message: "Number must be positive." }),
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
  };
}

export default function FormZodDemo() {
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Errors>({});
  const handleClearErrors = (next: Errors) => setErrors(next);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const formEl = event.currentTarget;
    setLoading(true);
    const response = await submitForm(event);
    await new Promise((r) => setTimeout(r, 800));
    setErrors(response.errors);
    setLoading(false);
    if (Object.keys(response.errors).length === 0) {
      const formData = new FormData(formEl);
      alert(
        `Name: ${String(formData.get("name") || "")}\nAge: ${String(
          formData.get("age") || ""
        )}`
      );
    }
  };

  return (
    <Form
      className="max-w-64"
      errors={errors}
      onClearErrors={handleClearErrors}
      onSubmit={onSubmit}
    >
      <Field name="name">
        <FieldLabel>Name</FieldLabel>
        <FieldControl disabled={loading} placeholder="Enter name" />
        <FieldError />
      </Field>
      <Field name="age">
        <FieldLabel>Age</FieldLabel>
        <FieldControl disabled={loading} placeholder="Enter age" />
        <FieldError />
      </Field>
      <Button disabled={loading} type="submit">
        Submit
      </Button>
    </Form>
  );
}
