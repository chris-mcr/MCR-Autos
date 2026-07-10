import type { ReactNode } from "react";

// Line icons drawn on a 24×24 grid. Stroke uses currentColor so callers set
// colour/size via the surrounding element. Add a new icon by adding a key here.
const icons: Record<string, ReactNode> = {
  // Trust strip
  shield: (
    <>
      <path d="M12 3l7 2.5v5.5c0 4.2-2.9 7.4-7 8.5-4.1-1.1-7-4.3-7-8.5V5.5L12 3z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  truck: (
    <>
      <path d="M1.5 6.5h11v8h-11z" />
      <path d="M12.5 9h3.6l3.4 3.4v2.1h-7z" />
      <circle cx="5.5" cy="16.5" r="1.6" />
      <circle cx="16.5" cy="16.5" r="1.6" />
    </>
  ),
  returns: (
    <>
      <path d="M9 15L4 10l5-5" />
      <path d="M4 10h10a5 5 0 0 1 5 5v3" />
    </>
  ),
  chat: (
    <>
      <path d="M4 5h16v10H9l-4 4v-4H4z" />
      <path d="M8 9h8M8 12h5" />
    </>
  ),
  // Categories
  brakes: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 5v1.5M12 17.5V19M5 12h1.5M17.5 12H19" />
    </>
  ),
  filters: <path d="M4 5h16l-6 7v6l-4 2v-8L4 5z" />,
  engine: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M18.8 5.2l-2.1 2.1M7.3 16.7l-2.1 2.1" />
    </>
  ),
  electrical: <path d="M13 2.5L4.5 13.5H11l-2 8 8.5-11H11l2-7.5z" />,
  suspension: (
    <>
      <path d="M7 3.5h10M7 20.5h10" />
      <path d="M8 5.5l8 2.7-8 2.7 8 2.7-8 2.7 8 2.7" />
    </>
  ),
  exterior: (
    <>
      <path d="M3 14l1.9-5.2A2 2 0 0 1 6.8 7.5h10.4a2 2 0 0 1 1.9 1.3L21 14v3h-2M5 17H3v-3h18" />
      <circle cx="7.5" cy="17" r="1.7" />
      <circle cx="16.5" cy="17" r="1.7" />
    </>
  ),
};

export default function Icon({
  name,
  size = 24,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}
