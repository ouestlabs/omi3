import { CornerUpLeftIcon, StarIcon } from "lucide-react";

import { Button } from "@/registry/default/ui/button";
import {
  PreviewCard,
  PreviewCardPopup,
  PreviewCardTrigger,
} from "@/registry/default/ui/preview-card";

export default function PreviewCardDemo() {
  return (
    <PreviewCard>
      <PreviewCardTrigger render={<Button variant="ghost" />}>
        coss.com/ui
      </PreviewCardTrigger>
      <PreviewCardPopup>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h4 className="font-medium text-sm">coss.com/ui</h4>
            <p className="text-muted-foreground text-sm">
              Beautifully designed components that you can copy and paste into
              your apps.
            </p>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground text-xs">
            <div className="flex items-center gap-1">
              <span
                aria-hidden="true"
                className="size-2 rounded-full bg-blue-500"
              />
              <span>TypeScript</span>
            </div>
            <div className="flex items-center gap-1">
              <StarIcon className="size-3" />
              <span>58.2k</span>
            </div>
            <div className="flex items-center gap-1">
              <CornerUpLeftIcon className="size-3" />
              <span>5.1k</span>
            </div>
          </div>
        </div>
      </PreviewCardPopup>
    </PreviewCard>
  );
}
