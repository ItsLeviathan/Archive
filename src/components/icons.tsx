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