import type { SVGProps } from "react";
const FolderIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="currentColor"
    viewBox="0 0 24 24"
    {...props}
   aria-hidden="true" role="img">
    <g>
      <path d="M22 11.07v5.58C22 19.6 19.6 22 16.65 22h-9.3C4.4 22 2 19.6 2 16.65V9.44h19.74c.15.45.23.91.25 1.4.01.07.01.16.01.23" />
      <path
        d="M21.74 9.44H2V6.42C2 3.98 3.98 2 6.42 2h2.33c1.63 0 2.14.53 2.79 1.4l1.4 1.86c.31.41.35.47.93.47h2.79c2.37-.01 4.39 1.55 5.08 3.71"
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
export { FolderIcon };
