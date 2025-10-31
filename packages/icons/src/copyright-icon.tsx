import type { SVGProps } from "react";

const CopyrightIcon = (props: SVGProps<SVGSVGElement>) => (
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
        d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10"
        opacity={0.4}
      />
      <path d="M12.24 16.75c-2.62 0-4.75-2.13-4.75-4.75s2.13-4.75 4.75-4.75c1.15 0 2.27.42 3.13 1.19.31.27.34.75.07 1.06-.28.31-.75.34-1.06.07-.59-.52-1.35-.81-2.14-.81-1.79 0-3.25 1.46-3.25 3.25s1.46 3.25 3.25 3.25c.78 0 1.55-.29 2.14-.81.31-.27.79-.24 1.06.07s.24.79-.07 1.06a4.8 4.8 0 0 1-3.13 1.17" />
    </g>
    <defs>
      <clipPath>
        <path d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export { CopyrightIcon };
