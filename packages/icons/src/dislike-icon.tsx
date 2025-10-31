import type { SVGProps } from "react";
const DislikeIcon = (props: SVGProps<SVGSVGElement>) => (
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
        d="M2.35 13.96c.39.56 1.08.88 1.87.88h4.1c.27 0 .52.11.69.31.18.2.25.48.21.77l-.51 3.28c-.22.98.43 2.08 1.41 2.41.91.34 1.98-.12 2.41-.77l4.21-6.27.12-.2V5.53l-.15-.15-3.17-2.45c-.42-.42-1.37-.65-2.04-.65H7.6c-1.34 0-2.69 1.01-2.99 2.24l-2.46 7.49c-.25.71-.18 1.41.2 1.95"
        opacity={0.4}
      />
      <path d="M18.79 17.61h1.03c1.55 0 2.18-.6 2.18-2.08V5.48C22 4 21.37 3.4 19.82 3.4h-1.03c-1.55 0-2.18.6-2.18 2.08v10.06c0 1.47.63 2.07 2.18 2.07" />
    </g>
    <defs>
      <clipPath>
        <path d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export { DislikeIcon };
