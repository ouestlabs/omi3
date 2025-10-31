import type { SVGProps } from "react";
const SidebarTopIcon = (props: SVGProps<SVGSVGElement>) => (
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
        d="M7.81 22h8.38c3.64 0 5.81-2.17 5.81-5.81V7.81c0-.2-.01-.4-.02-.59-.08-1.23-.43-2.27-1.03-3.09-.29-.42-.66-.79-1.08-1.08C18.92 2.36 17.68 2 16.19 2H7.81C4.37 2 2.24 3.94 2.03 7.22c-.02.19-.03.39-.03.59v8.38c0 1.49.36 2.73 1.05 3.68.29.42.66.79 1.08 1.08.95.69 2.19 1.05 3.68 1.05"
        opacity={0.4}
      />
      <path d="M2 8.72h20v-.91c0-.2-.01-.4-.02-.59H2.03c-.02.19-.03.39-.03.59zM15.31 14.97c0-.19-.07-.38-.22-.53l-2.56-2.56a.754.754 0 0 0-1.06 0l-2.56 2.56c-.29.29-.29.77 0 1.06s.77.29 1.06 0L12 13.48l2.03 2.03c.29.29.77.29 1.06 0 .15-.15.22-.34.22-.54" />
    </g>
    <defs>
      <clipPath>
        <path d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export { SidebarTopIcon };
