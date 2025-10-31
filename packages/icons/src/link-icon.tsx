import type { SVGProps } from "react";
const LinkIcon = (props: SVGProps<SVGSVGElement>) => (
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
        d="M11 7.5v9c0 .55-.45 1-1 1H7.5c-1.52 0-2.89-.62-3.89-1.61A5.55 5.55 0 0 1 2 12.22C1.88 9.08 4.62 6.5 7.77 6.5H10c.55 0 1 .45 1 1M22 11.78c.13 3.15-2.61 5.72-5.76 5.72h-2.23c-.55 0-1-.45-1-1v-9c0-.55.45-1 1-1h2.5c1.52 0 2.89.62 3.89 1.61.93.95 1.54 2.24 1.6 3.67"
        opacity={0.4}
      />
      <path d="M16 12.75H8c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h8c.41 0 .75.34.75.75s-.34.75-.75.75" />
    </g>
    <defs>
      <clipPath>
        <path d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export { LinkIcon };
