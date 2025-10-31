import type { SVGProps } from "react";

const SearchZoomInIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path d="M11.5 21a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19" opacity={0.4} />
    <path d="M21.3 22c-.18 0-.36-.07-.49-.2l-1.86-1.86a.706.706 0 0 1 0-.99c.27-.27.71-.27.99 0l1.86 1.86c.27.27.27.71 0 .99-.14.13-.32.2-.5.2M14.2 10.95h-1.75V9.2c0-.41-.34-.75-.75-.75s-.75.34-.75.75v1.75H9.2c-.41 0-.75.34-.75.75s.34.75.75.75h1.75v1.75c0 .41.34.75.75.75s.75-.34.75-.75v-1.75h1.75c.41 0 .75-.34.75-.75s-.34-.75-.75-.75" />
  </svg>
);
export { SearchZoomInIcon };
