"use client";

import * as React from "react";

import { Button } from "@/registry/default/ui/button";
import { Field, FieldLabel } from "@/registry/default/ui/field";
import { Form } from "@/registry/default/ui/form";
import { Switch } from "@/registry/default/ui/switch";

export default function SwitchFormDemo() {
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    console.log(formData.get("marketing"));

    const enabled = formData.get("marketing");
    alert(`Marketing emails: ${enabled}`);
  };

  return (
    <Form className="w-auto" onSubmit={onSubmit}>
      <Field name="marketing">
        <FieldLabel>
          <Switch defaultChecked disabled={loading} name="marketing" />
          Enable marketing emails
        </FieldLabel>
      </Field>
      <Button disabled={loading} type="submit">
        Submit
      </Button>
    </Form>
  );
}
