import { Box, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';

type Sentence = {
  index: number;
  text: string;
};

type Props = {
  sentences: Sentence[];
  height: number;
  setHeight: (height: number) => void;
  onRemove: (index: number) => void;
};

export default function SelectedSentencesBox({
  sentences,
  height,
  setHeight,
  onRemove,
}: Props) {
  const [open, setOpen] = useState(true);
  const [previousHeight, setPreviousHeight] = useState(height);

  function toggleBox() {
    if (open) {
      setPreviousHeight(height);
      setHeight(0);
    } else {
      setHeight(previousHeight);
    }

    setOpen(!open);
  }

  function handleResize(event: React.PointerEvent) {
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

  return (
    <>
      {/* Hamburger button */}
      <IconButton
        onClick={toggleBox}
        sx={{
          position: 'fixed',
          bottom: open ? height + 10 : 10,
          right: 20,
          backgroundColor: 'white',
          border: '1px solid #ccc',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
          zIndex: 1100,

          '&:hover': {
            backgroundColor: '#f5f5f5',
          },
        }}
      >
        {open ? <CloseIcon /> : <InfoIcon />}
      </IconButton>

      {/* Selected sentences box */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: `${height}px`,
          backgroundColor: 'white',
          borderTop: open ? '1px solid #ccc' : 'none',
          boxShadow: open ? '0 -2px 10px rgba(0, 0, 0, 0.1)' : 'none',
          zIndex: 1000,
        }}
      >
        {open && (
          <>
            {/* Drag handle */}
            <Box
              onPointerDown={handleResize}
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
                  backgroundColor: '#aaa',
                }}
              />
            </Box>

            <Box sx={{ px: 2 }}>
              <h3 style={{ margin: '0 0 8px' }}>Selected sentences:</h3>

              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignContent: 'flex-start',
                  gap: '8px',
                  overflowY: 'auto',
                  maxHeight: `calc(${height}px - 60px)`,
                }}
              >
                {sentences.map((sentence) => (
                  <Box
                    key={sentence.index}
                    onClick={() => onRemove(sentence.index)}
                    sx={{
                      backgroundColor: '#f0f0f0',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',

                      '&:hover': {
                        backgroundColor: '#d0d0d0',
                      },
                    }}
                  >
                    {sentence.text}
                  </Box>
                ))}
              </Box>
            </Box>
          </>
        )}
      </Box>
    </>
  );
}
