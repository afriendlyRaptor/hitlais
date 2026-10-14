import { type ReactNode } from 'react';
import { Typography } from '@mui/material';

type Props = {
  children: ReactNode;
  /** Top margin in theme spacing units. */
  mt?: number;
};

export function ValidationMessage({ children, mt = 1 }: Props) {
  return (
    <Typography variant="caption" color="error" sx={{ mt, display: 'block' }}>
      {children}
    </Typography>
  );
}
