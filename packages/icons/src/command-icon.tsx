import type { SVGProps } from "react";

const CommandIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <g>
      <path d="M16 8H8v8h8z" />
      <path
        d="M5 22c1.65 0 3-1.35 3-3v-3H5c-1.65 0-3 1.35-3 3s1.35 3 3 3M5 8h3V5c0-1.65-1.35-3-3-3S2 3.35 2 5s1.35 3 3 3M16 8h3c1.65 0 3-1.35 3-3s-1.35-3-3-3-3 1.35-3 3zM19 22c1.65 0 3-1.35 3-3s-1.35-3-3-3h-3v3c0 1.65 1.35 3 3 3"
        opacity={0.4}
      />
    </g>
    <defs>
      <clipPath>
        <path d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export { CommandIcon };
