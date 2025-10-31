import type { SVGProps } from "react";
const VolumeUpIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="currentColor"
    viewBox="0 0 24 24"
    {...props}
   aria-hidden="true" role="img">
    <g>
      <path d="M22 11.25h-1.25V10c0-.41-.34-.75-.75-.75s-.75.34-.75.75v1.25H18c-.41 0-.75.34-.75.75s.34.75.75.75h1.25V14c0 .41.34.75.75.75s.75-.34.75-.75v-1.25H22c.41 0 .75-.34.75-.75s-.34-.75-.75-.75" />
      <path
        d="M15.75 7.41v9.18c0 1.72-.62 3.01-1.73 3.63a3 3 0 0 1-1.47.37c-.8 0-1.66-.27-2.54-.82l-2.92-1.83c-.2-.12-.43-.19-.66-.19H5.5V6.25h.93c.23 0 .46-.07.66-.19l2.92-1.83c1.46-.91 2.89-1.07 4.01-.45 1.11.62 1.73 1.91 1.73 3.63"
        opacity={0.4}
      />
      <path d="M5.5 6.25v11.5H5c-2.42 0-3.75-1.33-3.75-3.75v-4c0-2.42 1.33-3.75 3.75-3.75z" />
    </g>
    <defs>
      <clipPath>
        <path d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export { VolumeUpIcon };
