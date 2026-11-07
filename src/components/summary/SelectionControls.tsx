import { Box, ButtonGroup, Typography } from '@mui/material';
import { LoggedButton } from '~/components/common';

type Props = {
  canClear: boolean;
  canSelect: boolean;
  tokensUsed: number;
  tokenLimit: number;
  onClear: () => void;
  onSelectFirst: () => void;
  onSelectRandom: () => void;
};

/** Floating bar (bottom centre): token usage and the quick-selection actions. */
export function SelectionControls({
  canClear,
  canSelect,
  tokensUsed,
  tokenLimit,
  onClear,
  onSelectFirst,
  onSelectRandom,
}: Props) {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1100,

        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.5,

        p: 0.75,
        borderRadius: '28px',

        backgroundColor: 'background.paper',
        boxShadow: 4,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography
        variant="caption"
        sx={{ fontWeight: 600, color: 'text.secondary', pt: 0.5 }}
      >
        {tokensUsed} / {tokenLimit} Tokens verwendet
      </Typography>

      <ButtonGroup
        variant="outlined"
        aria-label="Sentence selection actions"
        sx={{
          '& .MuiButton-root': {
            minWidth: 120,
            px: 2,
            py: 1.25,
            border: 'none',
            borderRadius: '999px',
            fontSize: '0.95rem',
            fontWeight: 600,
            textTransform: 'none',
          },
        }}
      >
        <LoggedButton
          logId="clear_all_sentences"
          onClick={onClear}
          disabled={!canClear}
        >
          Auswahl aufheben
        </LoggedButton>

        <LoggedButton
          logId="select_first_tokens"
          onClick={onSelectFirst}
          disabled={!canSelect}
        >
          Erste auswählen
        </LoggedButton>

        <LoggedButton
          logId="select_random_tokens"
          onClick={onSelectRandom}
          disabled={!canSelect}
        >
          Zufällige auswählen
        </LoggedButton>
      </ButtonGroup>
    </Box>
  );
}
