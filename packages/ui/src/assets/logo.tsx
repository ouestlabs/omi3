export const Logo = {
  AudioUI: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      aria-hidden="true"
      fill="none"
      height="1em"
      role="img"
      viewBox="0 0 24 24"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g>
        <mask
          height="1em"
          maskUnits="userSpaceOnUse"
          style={{
            maskType: "luminance",
          }}
          width="1em"
          x={0}
          y={0}
        >
          <path d="M24 0H0v24h24V0Z" fill="currentColor" />
        </mask>
        <g fill="currentColor">
          <path d="M5.75 16c-.41 0-.75-.34-.75-.75v-7.5c0-.41.34-.75.75-.75s.75.34.75.75v7.5c0 .41-.34.75-.75.75Zm6.5 5c-.41 0-.75-.34-.75-.75V2.75c0-.41.34-.75.75-.75s.75.34.75.75v17.5c0 .41-.34.75-.75.75Zm6.5-5c-.41 0-.75-.34-.75-.75v-7.5c0-.41.34-.75.75-.75s.75.34.75.75v7.5c0 .41-.34.75-.75.75Z" />
          <path d="M20.5 15.25c0 .962-.788 1.75-1.75 1.75S17 16.212 17 15.25v-7.5c0-.962.788-1.75 1.75-1.75s1.75.788 1.75 1.75v7.5Zm-13 0c0 .962-.788 1.75-1.75 1.75S4 16.212 4 15.25v-7.5C4 6.788 4.788 6 5.75 6s1.75.788 1.75 1.75v7.5Zm6.5 5c0 .962-.788 1.75-1.75 1.75s-1.75-.788-1.75-1.75V2.75c0-.962.788-1.75 1.75-1.75S14 1.788 14 2.75v17.5Z" />
        </g>
      </g>
      <defs>
        <clipPath>
          <path d="M0 0h24v24H0z" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  ),

  OuestLabs: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      height={32}
      viewBox="0 0 864 1080"
      width={32}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Ouest Labs</title>
      <path d="M216,1080V864H0V216H216V0H648V216H864V864H648v216Zm0-224.65H648V224.65H216Z" />
    </svg>
  ),
};
