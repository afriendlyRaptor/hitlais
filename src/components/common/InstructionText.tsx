import { Box, Typography } from '@mui/material';

type Props = {
  /** Plain text; `{{image:name.png}}` shows /public/instructions/name.png at that spot. */
  text: string;
};

/** Instruction text with optional inline images. */
export function InstructionText({ text }: Props) {
  // split() with a capture group alternates: text, image name, text, ...
  const parts = text.split(/\{\{image:(.+?)\}\}/);

  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 0 ? (
          <Typography
            key={index}
            sx={{ whiteSpace: 'pre-line', lineHeight: 1.7 }}
          >
            {part}
          </Typography>
        ) : (
          <Box
            key={index}
            component="img"
            src={`/instructions/${part}`}
            alt={part}
            sx={{ display: 'block', maxWidth: '100%', my: 2 }}
          />
        )
      )}
    </>
  );
}
