import type { SVGProps } from "react";

export function PostgresLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" {...props}>
      <path
        d="M32 7c-12.7 0-22 8.7-22 20.6 0 8.6 4.8 15.2 12.2 18.6l-1.8 7.5c-.3 1.4 1.1 2.5 2.3 1.8l8.1-4.8c1.4.2 2.8.4 4.2.4 12.8 0 22-8.7 22-20.6C57 15.6 47.2 7 32 7Z"
        fill="#336791"
      />
      <path
        d="M22.4 26.6c.9-4.7 4.6-8.1 9.6-8.1 5.4 0 9.5 3.9 9.5 9.2 0 5.9-4.4 10-10.9 10h-3.2l-.9 4.6 5.4-3.1c9.2.4 16.1-4.7 16.1-12.4 0-8.3-6.4-14.1-15.9-14.1-9.1 0-15.8 5.7-17.2 13.4-.5 2.8.2 5.4 2.2 7.4l2.6-2c-1.1-1.2-1.7-2.8-1.3-4.9Z"
        fill="white"
        opacity=".95"
      />
      <path
        d="M30.9 24.3c-2.7 0-4.6 1.8-4.6 4.4 0 2.4 1.8 4.1 4.3 4.1 2.9 0 4.9-1.9 4.9-4.5 0-2.4-1.9-4-4.6-4Z"
        fill="#103A5B"
      />
    </svg>
  );
}

export function RedisLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" {...props}>
      <path d="M8 43.5 32 55l24-11.5L32 32 8 43.5Z" fill="#A41E11" />
      <path d="M8 34.5 32 46l24-11.5L32 23 8 34.5Z" fill="#D82C20" />
      <path d="M8 25.5 32 37l24-11.5L32 14 8 25.5Z" fill="#EF3B2D" />
      <path d="M24.2 24.1 32 20.4l7.9 3.8-7.8 3.7-7.9-3.8Z" fill="#FFF0E8" />
      <path d="M18.2 27 22 25.2l7.9 3.8-3.8 1.8-7.9-3.8Z" fill="#7A130C" />
      <path d="M34.1 29 42 25.2l3.8 1.8-7.9 3.8-3.8-1.8Z" fill="#7A130C" />
    </svg>
  );
}
