interface IconLogoProps extends React.SVGProps<SVGSVGElement> {
  sparks?: boolean;
}

export function IconLogo({ sparks = false, ...props }: IconLogoProps) {
  return (
    <svg viewBox="0 0 64 64" {...props}>
      <path
        d="M32 6 C18 20 12 28 12 38 A20 17 0 0 0 52 38 C52 28 46 20 32 6 Z"
        fill="currentColor"
        transform="rotate(-14 32 32)"
      />
      {sparks && (
        <>
          <circle cx="47" cy="9" r="3.1" fill="currentColor" />
          <circle cx="54" cy="4" r="1.4" fill="currentColor" opacity="0.55" />
        </>
      )}
    </svg>
  );
}

export function IconSearch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...props}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.6" y2="16.6" />
    </svg>
  );
}

export function IconKeep(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...props}>
      <path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4.2L5 21V4.5a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

export function IconHeart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" {...props}>
      <path d="M12 20.5s-7.6-4.6-10-9.4C.4 7.6 2.4 4 6 4c2.1 0 3.7 1.2 6 3.6C14.3 5.2 15.9 4 18 4c3.6 0 5.6 3.6 4 7.1-2.4 4.8-10 9.4-10 9.4Z" />
    </svg>
  );
}

export function IconArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconArrowLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...props}>
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}

export function IconMenu(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" {...props}>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}

export function IconClose(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" {...props}>
      <line x1="5" y1="5" x2="19" y2="19" />
      <line x1="19" y1="5" x2="5" y2="19" />
    </svg>
  );
}
export function IconMoon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" {...props}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
    </svg>
  );
}

export function IconSun(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </svg>
  );
}

export function IconPen(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" {...props}>
      <path d="M4 20l1-4.5L15.5 5a2.1 2.1 0 0 1 3 3L8 18.5 4 20Z" />
      <path d="M13.5 7l3 3" />
    </svg>
  );
}

export function IconBook(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" {...props}>
      <path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5Z" />
      <path d="M12 6.5v13" />
    </svg>
  );
}

export function IconDiary(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" {...props}>
      <rect x="5" y="3" width="14" height="18" rx="1.5" />
      <path d="M9 3v18M12 8h4M12 11h4" />
    </svg>
  );
}

export function IconShuffle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 7h3.5c4 0 7 10 11 10H21M3 17h3.5c1.5 0 2.8-1.4 4-3.3M13.5 10.3C14.7 8.4 16 7 17.5 7H21M18.5 4.5 21 7l-2.5 2.5M18.5 14.5 21 17l-2.5 2.5" />
    </svg>
  );
}

export function IconLink(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" {...props}>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
    </svg>
  );
}

export function IconCamera(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" {...props}>
      <path d="M3.5 8.5a2 2 0 0 1 2-2h2.2l1.6-2.2h5.4l1.6 2.2h2.2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-9Z" />
      <circle cx="12" cy="12.8" r="3.6" />
    </svg>
  );
}
