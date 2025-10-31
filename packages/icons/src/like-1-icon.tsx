import type { SVGProps } from "react";

const LikeIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <g>
      <path
        d="M21.65 10.03c-.39-.56-1.08-.88-1.87-.88h-4.1c-.27 0-.52-.11-.69-.31-.18-.2-.25-.48-.21-.77l.51-3.28c.22-.98-.43-2.08-1.41-2.41-.91-.34-1.98.12-2.41.77L7.25 9.42l-.12.2v8.84l.15.15 3.17 2.45c.42.42 1.37.65 2.04.65h3.9c1.34 0 2.69-1.01 2.99-2.24l2.46-7.49c.26-.71.19-1.4-.19-1.95"
        opacity={0.4}
      />
      <path d="M5.21 6.38H4.18C2.63 6.38 2 6.98 2 8.46v10.06c0 1.48.63 2.08 2.18 2.08h1.03c1.55 0 2.18-.6 2.18-2.08V8.46c0-1.48-.63-2.08-2.18-2.08" />
    </g>
    <defs>
      <clipPath>
        <path d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export { LikeIcon };
