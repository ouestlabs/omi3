import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/layouts/global";

import { Button } from "@/registry/default/ui/button";

export const metadata: Metadata = {
  title: "Page Not Found",
  description:
    "The page you're looking for doesn't exist or may have been moved.",
};

export default function NotFound() {
  return (
    <div className="container w-full">
      <PageHeader>
        <PageHeaderHeading>Page Not Found</PageHeaderHeading>
        <PageHeaderDescription>
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved.
        </PageHeaderDescription>
        <div className="mt-4">
          <Button
            className="group"
            render={
              <Link href="/">
                <ArrowLeftIcon
                  aria-hidden="true"
                  className="-ms-1 group-hover:-translate-x-0.5 opacity-60 transition-transform"
                />
                Back to Home
              </Link>
            }
            size="lg"
          />
        </div>
      </PageHeader>
    </div>
  );
}
