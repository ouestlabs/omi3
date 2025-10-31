import type { SVGProps } from "react";
const SidebarBottomIcon = (props: SVGProps<SVGSVGElement>) => (
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
        d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81v8.38c0 .2.01.4.02.59.08 1.23.43 2.27 1.03 3.09.29.42.66.79 1.08 1.08.95.69 2.19 1.05 3.68 1.05h8.38c3.44 0 5.57-1.94 5.78-5.22.02-.19.03-.39.03-.59V7.81c0-1.49-.36-2.73-1.05-3.68-.29-.42-.66-.79-1.08-1.08C18.92 2.36 17.68 2 16.19 2"
        opacity={0.4}
      />
      <path d="M22 15.28H2v.91c0 .2.01.4.02.59h19.95c.02-.19.03-.39.03-.59zM8.69 9.03c0 .19.07.38.22.53l2.56 2.56c.29.29.77.29 1.06 0l2.56-2.56c.29-.29.29-.77 0-1.06a.754.754 0 0 0-1.06 0L12 10.52 9.97 8.5c-.29-.3-.77-.3-1.06 0a.7.7 0 0 0-.22.53" />
    </g>
    <defs>
      <clipPath>
        <path d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export { SidebarBottomIcon };
