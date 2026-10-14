import { type ReactNode } from 'react';
import { Box, Button } from '@mui/material';
import { DrawerAppBar } from '~/components/app-bar';
import { largePillSx } from '~/components/common';

type Props = {
  children: ReactNode;
  /** Without a handler no button is shown. */
  onSubmit?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
};

/** Page frame shared by the non-task steps: app bar, centred content, button. */
export function StepLayout({
  children,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Weiter',
}: Props) {
  return (
    <>
      <DrawerAppBar />

      <Box
        sx={{
          maxWidth: 720,
          mx: 'auto',
          px: 4,
          py: 5,
          pb: 14, // leave room for the button
        }}
      >
        {children}
      </Box>

      {onSubmit && (
        <Box sx={{ display: 'flex', justifyContent: 'center', pb: 2 }}>
          <Button
            variant="contained"
            onClick={onSubmit}
            disabled={isSubmitting}
            sx={largePillSx}
          >
            {submitLabel}
          </Button>
        </Box>
      )}
    </>
  );
}
