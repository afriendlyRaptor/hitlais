import { useMemo, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { DrawerAppBar } from '~/components/ui';
import { LikertScale } from '~/components/ui/LikertScale';
import { logAction } from '~/services';
import { useLocation } from 'wouter';

type LikertQuestion = {
  id: string;
  question: string;
};

const QUESTIONS: LikertQuestion[] = [
  { id: 'q1', question: 'Ich kann besser zusammenfassen als eine KI.' },
  { id: 'q2', question: 'Der Score hat meine Satzauswahl beeinflusst.' },
  {
    id: 'q3',
    question: 'Zusammenfassungen von Menschen sind besser als die einer KI',
  },
  {
    id: 'q4',
    question: 'Mit menschlicher Hilfe werden KI Zusammenfassungen besser.',
  },
];

export default function Survey() {
  const [, navigate] = useLocation();

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isComplete = useMemo(
    () => QUESTIONS.every((q) => answers[q.id] != null),
    [answers]
  );

  const handleAnswerChange = (id: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    setSubmitAttempted(true);
    if (!isComplete || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await logAction('survey_submit', { answers });
      navigate('/about'); // or wherever "done" should go
    } catch (err) {
      console.error('Survey submit failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DrawerAppBar />

      <Box
        sx={{
          maxWidth: 720,
          mx: 'auto',
          px: 4,
          py: 5,
          pb: 14, // leave room for the fixed submit button
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Quick survey
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Please rate the following statements from 1 (strongly disagree) to 5
          (strongly agree).
        </Typography>

        {QUESTIONS.map((q) => (
          <LikertScale
            key={q.id}
            id={q.id}
            question={q.question}
            value={answers[q.id] ?? null}
            onChange={handleAnswerChange}
          />
        ))}

        {submitAttempted && !isComplete && (
          <Typography
            variant="caption"
            color="error"
            sx={{ mt: 1, display: 'block' }}
          >
            Please answer every question before submitting.
          </Typography>
        )}
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
          onClick={handleSubmit}
          disabled={isSubmitting}
          sx={{
            minWidth: 160,
            px: 4,
            py: 1.75,
            borderRadius: '999px',
            boxShadow: 4,
            fontSize: '1.05rem',
            fontWeight: 600,
            textTransform: 'none',
          }}
        >
          {isSubmitting ? 'Submitting…' : 'Submit'}
        </Button>
      </Box>
    </>
  );
}
