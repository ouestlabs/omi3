"use client";

import {
  Field,
  FieldControl,
  FieldLabel,
  FieldValidity,
} from "@/registry/default/ui/field";

export default function FieldWithValidityDemo() {
  return (
    <Field>
      <FieldLabel>Email</FieldLabel>
      <FieldControl placeholder="Enter your email" required type="email" />
      <FieldValidity>
        {(validity) => (
          <div className="flex w-full flex-col gap-2">
            {validity.error && (
              <p className="text-destructive-foreground text-xs">
                {validity.error}
              </p>
            )}
            <div className="w-full rounded-md bg-muted p-2">
              <pre className="no-scrollbar max-h-60 overflow-y-auto font-mono text-xs">
                {JSON.stringify(validity, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </FieldValidity>
    </Field>
  );
}
