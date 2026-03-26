function NavLogo() {
  return (
    <svg
      viewBox='0 0 28 28'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'
      className='w-7 h-7 shrink-0'
    >
      <circle cx='14' cy='14' r='14' fill='rgba(45,139,139,0.2)' />
      <path
        d='M5 15 Q 9 11, 13 15 Q 17 19, 21 15'
        stroke='#3aad63'
        strokeWidth='1.8'
        fill='none'
        strokeLinecap='round'
      />
      <path
        d='M5 18.5 Q 9 14.5, 13 18.5 Q 17 22.5, 21 18.5'
        stroke='#3aad63'
        strokeWidth='1.2'
        fill='none'
        strokeLinecap='round'
        opacity='0.5'
      />
      <path
        d='M15.5 7 L12 13.5 L15 13.5 L12.5 20 L16 12.5 L13 12.5 Z'
        fill='#f0a500'
        opacity='0.95'
      />
    </svg>
  );
}

export function Navbar() {
  return (
    <nav
      role='navigation'
      aria-label='Main navigation'
      className='w-full h-[60px] flex items-center justify-between px-md border-b border-border bg-[rgba(13,18,32,0.82)] backdrop-blur-lg sticky top-0 z-[100]'
    >
      <a
        href='#'
        aria-label="What's Watt home"
        className='flex items-center gap-sm no-underline'
      >
        <NavLogo />
        <span className='font-display font-bold text-lg text-text-primary tracking-[-0.02em]'>
          What&apos;s<span className='text-brand-light'>Watt</span>
        </span>
      </a>
      <a
        href='#'
        aria-label='About'
        className='text-sm font-medium text-text-secondary hover:text-text-primary transition-colors'
      >
        About
      </a>
    </nav>
  );
}
