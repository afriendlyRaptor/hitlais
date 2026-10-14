import { type ReactNode } from 'react';
import { Box, Button } from '@mui/material';
import { DrawerAppBar } from '~/components/app-bar';
import { largePillSx } from '~/components/common';

type Props = {
  children: ReactNode;
  isSubmitting: boolean;
  onSubmit: () => void;
};

/** Page frame shared by the survey screens: app bar, centred content, submit button. */
export function SurveyLayout({ children, isSubmitting, onSubmit }: Props) {
  return (
    <>
      <DrawerAppBar />

      <Box
        sx={{
          maxWidth: 720,
          mx: 'auto',
          px: 4,
          py: 5,
          pb: 14, // leave room for the submit button
        }}
      >
        {children}
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 0,
          pb: 2,
        }}
      >
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={isSubmitting}
          sx={largePillSx}
        >
          {isSubmitting ? 'Submitting…' : 'Submit'}
        </Button>
      </Box>
    </>
  );
}
