import type { SVGProps } from "react";
const ToggleOnCircleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="currentColor"
    viewBox="0 0 24 24"
    {...props}
   aria-hidden="true" role="img">
    <g>
      <path
        d="M10.14 3.86h3.72C18.35 3.86 22 7.51 22 12s-3.65 8.14-8.14 8.14h-3.72C5.65 20.14 2 16.49 2 12s3.65-8.14 8.14-8.14"
        opacity={0.4}
      />
      <path d="M13.86 16.42a4.42 4.42 0 1 0 0-8.84 4.42 4.42 0 0 0 0 8.84" />
    </g>
    <defs>
      <clipPath>
        <path d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export { ToggleOnCircleIcon };
