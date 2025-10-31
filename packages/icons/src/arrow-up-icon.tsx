import type { SVGProps } from "react";

const ArrowUpIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    fill="currentColor"
    height="1em"
    viewBox="0 0 24 24"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    aria-hidden="true"
    role="img"
  >
    <path d="M9.33 18h5.34c3.32 0 4.67-2.35 3.02-5.22l-.74-1.28c-.18-.31-.51-.5-.87-.5H7.92c-.36 0-.69.19-.87.5l-.74 1.28C4.66 15.65 6.01 18 9.33 18" />
    <path
      d="M8.79 10h6.43c.39 0 .63-.42.43-.75l-.64-1.1c-1.65-2.87-4.37-2.87-6.02 0l-.64 1.1c-.19.33.05.75.44.75"
      opacity={0.4}
    />
  </svg>
);
export { ArrowUpIcon };
