"use client"; // Error boundaries must be Client Components

import NextError from "next/error";
import posthog from "posthog-js";
import { useEffect } from "react";

export default function GlobalError({
  error,
  _reset,
}: {
  error: Error & { digest?: string };
  _reset: () => void;
}) {
  useEffect(() => {
    posthog.captureException(error);
  }, [error]);

  return (
    // global-error must include html and body tags
    <html lang="en">
      <body>
        {/* `NextError` is the default Next.js error page component */}
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
