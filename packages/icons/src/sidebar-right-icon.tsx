import type { SVGProps } from "react";
const SidebarRightIcon = (props: SVGProps<SVGSVGElement>) => (
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
        d="M2 7.81v8.38C2 19.83 4.17 22 7.81 22h8.38c.2 0 .4-.01.59-.02 1.23-.08 2.27-.43 3.09-1.03.42-.29.79-.66 1.08-1.08.69-.95 1.05-2.19 1.05-3.68V7.81c0-3.44-1.94-5.57-5.22-5.78-.19-.02-.39-.03-.59-.03H7.81c-1.49 0-2.73.36-3.68 1.05-.42.29-.79.66-1.08 1.08C2.36 5.08 2 6.32 2 7.81"
        opacity={0.4}
      />
      <path d="M15.28 2v20h.91c.2 0 .4-.01.59-.02V2.03c-.19-.02-.39-.03-.59-.03zM9.03 15.31c.19 0 .38-.07.53-.22l2.56-2.56c.29-.29.29-.77 0-1.06L9.56 8.91a.755.755 0 0 0-1.06 0c-.29.29-.29.77 0 1.06L10.52 12 8.5 14.03c-.29.29-.29.77 0 1.06.14.15.33.22.53.22" />
    </g>
    <defs>
      <clipPath>
        <path d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export { SidebarRightIcon };
