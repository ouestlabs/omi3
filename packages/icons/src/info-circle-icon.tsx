import type { SVGProps } from "react";
const InfoCircleIcon = (props: SVGProps<SVGSVGElement>) => (
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
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10"
        opacity={0.4}
      />
      <path d="M12 13.75c.41 0 .75-.34.75-.75V8c0-.41-.34-.75-.75-.75s-.75.34-.75.75v5c0 .41.34.75.75.75M12.92 15.62q-.075-.18-.21-.33-.15-.135-.33-.21a1 1 0 0 0-.76 0q-.18.075-.33.21-.135.15-.21.33c-.05.12-.08.25-.08.38s.03.26.08.38c.05.13.12.23.21.33q.15.135.33.21c.12.05.25.08.38.08s.26-.03.38-.08q.18-.075.33-.21c.09-.1.16-.2.21-.33.05-.12.08-.25.08-.38s-.03-.26-.08-.38" />
    </g>
    <defs>
      <clipPath>
        <path d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export { InfoCircleIcon };
