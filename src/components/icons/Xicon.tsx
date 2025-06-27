import * as React from 'react';

export default function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path d="M20.97 3H17.1l-4.37 5.18L8.42 3H3.14l6.5 8.64L2.99 21h3.87l4.48-5.31L15.6 21h5.29l-6.92-9.19L20.97 3Zm-3.3 16h-1.56l-5.13-6.84L5.3 5h1.56l5.13 6.84L17.67 19Z" />
    </svg>
  );
}