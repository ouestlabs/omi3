import type { SVGProps } from "react";

const MaskIcon = (props: SVGProps<SVGSVGElement>) => (
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
      <path
        d="M21.97 12c0 2.94-1.28 5.6-3.32 7.41A9.84 9.84 0 0 1 12 21.97c-5.5 0-9.97-4.47-9.97-9.97S6.5 2.03 12 2.03c2.56 0 4.89.96 6.65 2.56A9.9 9.9 0 0 1 21.97 12"
        opacity={0.4}
      />
      <path d="M11.97 16.39c-.02 1.65-1.25 2.05-2.4 1.59A6.44 6.44 0 0 1 5.53 12c0-2.71 1.67-5.03 4.04-5.99 1.15-.46 2.38-.05 2.4 1.59z" />
    </g>
    <defs>
      <clipPath>
        <path d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export { MaskIcon };
