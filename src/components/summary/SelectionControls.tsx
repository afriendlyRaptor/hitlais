import { Box, ButtonGroup } from '@mui/material';
import { LoggedButton } from '~/components/common';

type Props = {
  canClear: boolean;
  canSelect: boolean;
  onClear: () => void;
  onSelectFirst: () => void;
  onSelectRandom: () => void;
};

/** Floating button bar (bottom left) with the quick-selection actions. */
export function SelectionControls({
  canClear,
  canSelect,
  onClear,
  onSelectFirst,
  onSelectRandom,
}: Props) {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        left: 24,
        zIndex: 1100,

        display: 'flex',
        alignItems: 'center',

        p: 0.75,
        borderRadius: '999px',

        backgroundColor: 'background.paper',
        boxShadow: 4,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
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
          Clear all
        </LoggedButton>

        <LoggedButton
          logId="select_first_tokens"
          onClick={onSelectFirst}
          disabled={!canSelect}
        >
          Select first
        </LoggedButton>

        <LoggedButton
          logId="select_random_tokens"
          onClick={onSelectRandom}
          disabled={!canSelect}
        >
          Select random
        </LoggedButton>
      </ButtonGroup>
    </Box>
  );
}
