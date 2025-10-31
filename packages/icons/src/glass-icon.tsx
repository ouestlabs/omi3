import type { SVGProps } from "react";
const GlassIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="currentColor"
    viewBox="0 0 24 24"
    {...props}
   aria-hidden="true" role="img">
    <g>
      <path d="M15.84 22H8.16c-4.19 0-5.02-2.53-3.66-5.61l1.44-3.27S9 13 12 14s5.83-.89 5.83-.89l.19-.12 1.49 3.41c1.34 3.08.46 5.6-3.67 5.6" />
      <path
        d="m18.02 12.99-.19.12S15 15 12 14s-6.06-.88-6.06-.88l2.8-6.38h-.3c-.65 0-1.25-.26-1.68-.69s-.69-1.03-.69-1.68C6.07 3.07 7.13 2 8.44 2h7.11c.66 0 1.25.27 1.68.7.56.56.85 1.38.63 2.25-.26 1.08-1.3 1.79-2.42 1.79h-.16z"
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
export { GlassIcon };
