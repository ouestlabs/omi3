import type { SVGProps } from "react";
const UnlockIcon = (props: SVGProps<SVGSVGElement>) => (
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
        d="M12 17.35a1.63 1.63 0 1 0 0-3.26 1.63 1.63 0 0 0 0 3.26"
        opacity={0.4}
      />
      <path d="M16.65 9.44h-9.3C3.25 9.44 2 10.69 2 14.79v1.86C2 20.75 3.25 22 7.35 22h9.3c4.1 0 5.35-1.25 5.35-5.35v-1.86c0-4.1-1.25-5.35-5.35-5.35M12 18.74c-1.67 0-3.02-1.36-3.02-3.02S10.33 12.7 12 12.7s3.02 1.36 3.02 3.02-1.35 3.02-3.02 3.02" />
      <path
        d="M7.12 9.45V8.28c0-2.93.83-4.88 4.88-4.88 4.33 0 4.88 2.11 4.88 3.95 0 .39.31.7.7.7s.7-.31.7-.7C18.28 3.8 16.17 2 12 2 6.37 2 5.72 5.58 5.72 8.28v1.25c.42-.05.89-.08 1.4-.08"
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
export { UnlockIcon };
