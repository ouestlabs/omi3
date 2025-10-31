import type { SVGProps } from "react";
const FolderOpenIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="currentColor"
    viewBox="0 0 24 24"
    {...props}
   aria-hidden="true" role="img">
    <g>
      <path d="m21.06 11.82-.16-.22q-.42-.51-.99-.81c-.51-.29-1.09-.44-1.69-.44H5.77c-.6 0-1.17.15-1.69.44-.39.21-.74.5-1.03.86-.57.73-.84 1.63-.75 2.53l.37 4.67c.13 1.41.3 3.15 3.47 3.15h11.72c3.17 0 3.33-1.74 3.47-3.16l.37-4.65c.09-.84-.13-1.68-.64-2.37m-6.67 5.52H9.6c-.39 0-.7-.32-.7-.7s.31-.7.7-.7h4.79c.39 0 .7.32.7.7 0 .39-.31.7-.7.7" />
      <path
        d="M3.38 11.31c.22-.2.44-.38.7-.52.51-.29 1.09-.44 1.69-.44h12.46c.6 0 1.17.15 1.69.44.26.14.49.32.7.53v-1.5c0-3.57-1.09-4.66-4.66-4.66h-2.38c-.44 0-.45-.01-.71-.35l-1.2-1.61C11.1 2.46 10.65 2 9.22 2H8.04C4.47 2 3.38 3.09 3.38 6.66v4.65"
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
export { FolderOpenIcon };
