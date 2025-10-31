import type { SVGProps } from "react";
const MusicnoteIcon = (props: SVGProps<SVGSVGElement>) => (
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
        d="M19.26 2.87 14.84 1.4c-.92-.31-1.85-.2-2.53.3-.69.5-1.08 1.34-1.08 2.31v3.77l6.88 2.29c.34.12.69.17 1.02.17.56 0 1.08-.16 1.51-.47.69-.5 1.08-1.34 1.08-2.31V6.28c0-1.43-1.1-2.96-2.46-3.41"
        opacity={0.4}
      />
      <path d="M12.72 8.27V18c0 2.62-2.13 4.75-4.75 4.75S3.22 20.62 3.22 18s2.13-4.75 4.75-4.75c1.26 0 2.4.5 3.25 1.3V7.77z" />
    </g>
    <defs>
      <clipPath>
        <path d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export { MusicnoteIcon };
