/* Lightweight inline brand marks — sized to inherit currentColor,
   matching the footer's existing text-color/hover system. */

export function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6.5 0h3.83v1.64h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5.93c0-1.41-.03-3.23-1.97-3.23-1.97 0-2.27 1.54-2.27 3.13V21h-4V9Z" />
    </svg>
  );
}

export function InstagramIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.9 3H21.6l-6.06 6.93L22.7 21h-5.6l-4.38-5.73L7.7 21H5l6.48-7.41L4.5 3h5.74l3.96 5.24L18.9 3Zm-.98 16.17h1.5L7.14 4.75H5.53l12.4 14.42Z" />
    </svg>
  );
}

export function YoutubeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M22 12s0-3.2-.41-4.72a2.7 2.7 0 0 0-1.9-1.92C18.2 5 12 5 12 5s-6.2 0-7.69.36a2.7 2.7 0 0 0-1.9 1.92C2 8.8 2 12 2 12s0 3.2.41 4.72c.24.9.95 1.6 1.9 1.85C5.8 19 12 19 12 19s6.2 0 7.69-.43a2.7 2.7 0 0 0 1.9-1.85C22 15.2 22 12 22 12Zm-12 2.73V9.27L15.27 12 10 14.73Z" />
    </svg>
  );
}
