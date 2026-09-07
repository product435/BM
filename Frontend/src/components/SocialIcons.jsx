/* Lightweight inline brand marks — sized to inherit currentColor,
   matching the footer's existing text-color/hover system. */

export function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M14.5 8.5H16.5V5.2C16.17 5.15 15.03 5 13.7 5C10.9 5 9 6.66 9 9.7V12.5H6V16.2H9V22H12.9V16.2H15.79L16.25 12.5H12.9V10.05C12.9 9 13.18 8.5 14.5 8.5Z" />
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

export function WhatsappIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12.02 2C6.5 2 2.03 6.47 2.03 12c0 1.85.5 3.58 1.36 5.07L2 22l5.08-1.33A9.93 9.93 0 0 0 12.02 22C17.55 22 22 17.53 22 12S17.55 2 12.02 2Zm5.8 14.13c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.42-.13-.95-.3-1.64-.6-2.88-1.24-4.76-4.13-4.9-4.32-.14-.19-1.17-1.56-1.17-2.98 0-1.42.74-2.11 1-2.4.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.58.81 2 .88 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.72 1.19 1.55 1.93 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.17-.19.71-.83.9-1.11.19-.28.38-.24.63-.14.26.09 1.63.77 1.91.91.28.14.47.21.54.33.07.12.07.68-.17 1.36Z" />
    </svg>
  );
}
