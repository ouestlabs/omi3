import type { SVGProps } from "react";

const BackwardIcon = (props: SVGProps<SVGSVGElement>) => (
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
        d="M22 8.34v7.32c0 1.5-1.63 2.44-2.93 1.69l-3.17-1.83-3.17-1.83-.49-.28v-2.82l.49-.28 3.17-1.83 3.17-1.83c1.3-.75 2.93.19 2.93 1.69"
        opacity={0.4}
      />
      <path d="M12.24 8.34v7.32c0 1.5-1.63 2.44-2.92 1.69l-3.18-1.83-3.17-1.83c-1.29-.75-1.29-2.63 0-3.38l3.17-1.83 3.18-1.83c1.29-.75 2.92.19 2.92 1.69" />
    </g>
    <defs>
      <clipPath>
        <path d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export { BackwardIcon };
