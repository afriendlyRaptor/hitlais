/** Fully rounded button look shared across the app. Spread into `sx`. */
export const pillSx = {
  borderRadius: '999px',
  textTransform: 'none',
  fontWeight: 600,
} as const;

/** Big pill with shadow, used for the main call-to-action buttons. */
export const largePillSx = {
  ...pillSx,
  minWidth: 160,
  px: 4,
  py: 1.75,
  boxShadow: 4,
  fontSize: '1.05rem',
} as const;
