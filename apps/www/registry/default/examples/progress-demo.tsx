"use client";

import * as React from "react";

import { Progress } from "@/registry/default/ui/progress";

export default function ProgressDemo() {
  const [value, setValue] = React.useState(20);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setValue((current) =>
        Math.min(100, Math.round(current + Math.random() * 25))
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <Progress value={value} />;
}
