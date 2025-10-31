import { mergeProps } from "@base-ui-components/react/merge-props";
import { useRender } from "@base-ui-components/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

import { cn } from "audio-ui/lib/utils";

const spinnerVariants = cva("relative block opacity-65", {
  variants: {
    size: {
      sm: "size-5",
      md: "size-9",
      lg: "size-10",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

export interface SpinnerProps
  extends useRender.ComponentProps<"span">,
    VariantProps<typeof spinnerVariants> {
  loading?: boolean;
}

const SPINNER_LEAVES = Array.from({ length: 8 }, (_, i) => `spinner-leaf-${i}`);
const DEGREE_PER_LEAF = 45;
const ANIMATION_DELAY = 100;
function Spinner({
  className,
  size,
  loading = true,
  render,
  ...props
}: SpinnerProps) {
  const [bgColorClass, filteredClassName] = React.useMemo(() => {
    const bgClass = className?.match(/(?:dark:bg-|bg-)\S+/g) || ["bg-current"];
    const filteredClasses = className
      ?.replace(/(?:dark:bg-|bg-)\S+/g, "")
      .trim();
    return [bgClass, filteredClasses];
  }, [className]);

  const defaultProps = Object.freeze({
    "data-slot": "spinner",
    className: cn(spinnerVariants({ size, className: filteredClassName })),
    children: SPINNER_LEAVES.map((_, i) => (
      <span
        className="absolute top-0 left-1/2 h-full w-[12.5%] animate-spinner-leaf-fade"
        key={SPINNER_LEAVES[i]}
        style={{
          transform: `rotate(${i * DEGREE_PER_LEAF}deg)`,
          animationDelay: `${-(SPINNER_LEAVES.length - i) * ANIMATION_DELAY}ms`,
          transformOrigin: "0% 50%",
        }}
      >
        <span
          className={cn("block h-[30%] w-full rounded-full", bgColorClass)}
        />
      </span>
    )),
  });

  const Comp = useRender({
    defaultTagName: "span",
    render,
    props: mergeProps<"span">(defaultProps, props),
  });

  return loading ? Comp : null;
}

export { Spinner };
