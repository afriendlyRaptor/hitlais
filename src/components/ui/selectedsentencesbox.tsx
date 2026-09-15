import { Box, IconButton, useTheme } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { logAction } from '~/services';
import ScoreLineChart from './ScoreLineChart';
import ScoreDisplay from './ScoreDisplay';

type Sentence = {
  index: number;
  text: string;
};

type ScoreEntry = {
  timestamp: number;
  score: number;
};

type Props = {
  sentences: Sentence[];
  height: number;
  setHeight: (height: number) => void;
  onRemove: (index: number) => void;
  scoreHistory?: ScoreEntry[];
};

const MIN_CHART_WIDTH = 60;
const MAX_CHART_WIDTH = 400;
const DEFAULT_CHART_WIDTH = 220;

export default function SelectedSentencesBox({
  sentences,
  height,
  setHeight,
  onRemove,
  scoreHistory = [],
}: Props) {
  const [open, setOpen] = useState(true);
  const [previousHeight, setPreviousHeight] = useState(height);
  const [chartWidth, setChartWidth] = useState(DEFAULT_CHART_WIDTH);

  const theme = useTheme();

  const latestScore =
    scoreHistory.length > 0
      ? scoreHistory[scoreHistory.length - 1].score
      : undefined;

  function toggleBox() {
    logAction('selected_sentences_panel_toggled', { open: !open });

    if (open) {
      setPreviousHeight(height);
      setHeight(0);
    } else {
      setHeight(previousHeight);
    }

    setOpen(!open);
  }

  function handleResizeHeight(event: React.PointerEvent) {
    const startY = event.clientY;
    const startHeight = height;

    function move(event: PointerEvent) {
      const newHeight = startHeight + (startY - event.clientY);
      const newHeightLimited = Math.min(
        Math.max(newHeight, 80),
        window.innerHeight * 0.7
      );
      setHeight(newHeightLimited);
      setPreviousHeight(newHeightLimited);
    }

    function stop() {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
    }

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop);
  }

  function handleResizeChartWidth(event: React.PointerEvent) {
    const startX = event.clientX;
    const startWidth = chartWidth;

    function move(event: PointerEvent) {
      const newWidth = startWidth + (startX - event.clientX);
      const newWidthLimited = Math.min(
        Math.max(newWidth, MIN_CHART_WIDTH),
        MAX_CHART_WIDTH
      );
      setChartWidth(newWidthLimited);
    }

    function stop() {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
    }

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop);
  }

  return (
    <>
      <IconButton
        onClick={toggleBox}
        sx={{
          position: 'fixed',
          bottom: open ? height + 10 : 10,
          right: 20,
          border: '1px solid',
          boxShadow: theme.shadows[3],
          zIndex: 1100,
          backgroundColor: 'background.paper',
        }}
      >
        {open ? <CloseIcon /> : <InfoIcon />}
      </IconButton>

      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: `${height}px`,
          borderTop: open ? '1px solid' : 'none',
          boxShadow: open ? theme.shadows[4] : 'none',
          zIndex: 1000,
          backgroundColor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {open && (
          <>
            <Box
              onPointerDown={handleResizeHeight}
              sx={{
                height: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'ns-resize',
                touchAction: 'none',
              }}
            >
              <Box
                sx={{
                  width: '40px',
                  height: '4px',
                  borderRadius: '4px',
                  backgroundColor: 'secondary.main',
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
              <Box sx={{ px: 2, flex: 1, minWidth: 0 }}>
                <h3 style={{ margin: '0 0 8px' }}>Selected sentences:</h3>

                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignContent: 'flex-start',
                    gap: '8px',
                    overflowY: 'auto',
                    maxHeight: `calc(${height}px - 80px)`,
                  }}
                >
                  {sentences.map((sentence) => (
                    <Box
                      key={sentence.index}
                      onClick={() => onRemove(sentence.index)}
                      sx={{
                        padding: '6px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        backgroundColor: 'secondary.main',
                      }}
                    >
                      {sentence.text}
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Drag handle resizes the chart, not the score */}
              <Box
                onPointerDown={handleResizeChartWidth}
                sx={{
                  width: '12px',
                  cursor: 'ew-resize',
                  touchAction: 'none',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                <Box
                  sx={{
                    width: '4px',
                    height: '40px',
                    borderRadius: '4px',
                    backgroundColor: 'secondary.main',
                  }}
                />
              </Box>

              <ScoreLineChart history={scoreHistory} width={chartWidth} />

              {/* Pinned to the far right, unaffected by chart resizing */}
              <ScoreDisplay latestScore={latestScore} boxHeight={height} />
            </Box>
          </>
        )}
      </Box>
    </>
  );
}
