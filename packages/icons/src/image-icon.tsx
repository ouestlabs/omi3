import type { SVGProps } from "react";
const ImageIcon = (props: SVGProps<SVGSVGElement>) => (
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
        d="M22.02 16.82 18.89 9.5c-.57-1.34-1.42-2.1-2.39-2.15-.96-.05-1.89.62-2.6 1.9L12 12.66c-.4.72-.97 1.15-1.59 1.2-.63.06-1.26-.27-1.77-.92l-.22-.28c-.71-.89-1.59-1.32-2.49-1.23s-1.67.71-2.18 1.72L2.02 16.6c-.62 1.25-.56 2.7.17 3.88s2 1.89 3.39 1.89h12.76c1.34 0 2.59-.67 3.33-1.79.76-1.12.88-2.53.35-3.76"
        opacity={0.4}
      />
      <path d="M6.97 8.38a3.38 3.38 0 1 0 0-6.76 3.38 3.38 0 0 0 0 6.76" />
    </g>
    <defs>
      <clipPath>
        <path d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export { ImageIcon };
