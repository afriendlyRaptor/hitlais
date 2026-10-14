import { Typography } from '@mui/material';

type Props = {
  title: string;
  description: string;
};

export function SurveyHeader({ title, description }: Props) {
  return (
    <>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {description}
      </Typography>
    </>
  );
}
