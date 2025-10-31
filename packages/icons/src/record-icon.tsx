import type { SVGProps } from "react";
const RecordIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="currentColor"
    viewBox="0 0 24 24"
    {...props}
   aria-hidden="true" role="img">
    <g>
      <path d="m20.12 8.13-1.42.85-13.94 8.36A8.97 8.97 0 0 1 3 12a9 9 0 0 1 9-9c3.58 0 6.68 2.1 8.12 5.13" />
      <path
        d="M21 12a9 9 0 0 1-9 9c-2.47 0-4.7-.99-6.33-2.61l.09-.05L19.7 9.98l.93-.55c.24.82.37 1.68.37 2.57"
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
export { RecordIcon };
