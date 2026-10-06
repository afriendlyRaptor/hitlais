import { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
} from '@mui/material';
import { DrawerAppBar } from '~/components/ui';
import { LikertScale } from '~/components/ui/LikertScale';
import { logAction } from '~/services';
import { useLocation } from 'wouter';

type LikertQuestion = {
  id: string;
  question: string;
};

const SUMMARY_A = `Hier steht die erste Zusammenfassung des Textes. 
Ersetzen Sie diesen Text durch die tatsächliche Zusammenfassung, die dem Benutzer angezeigt werden soll.`;

const SUMMARY_B = `Hier steht die zweite Zusammenfassung des Textes.
Ersetzen Sie diesen Text durch die andere Zusammenfassung, die der Benutzer bewerten soll.`;

const QUESTIONS: LikertQuestion[] = [
  {
    id: 'q1',
    question:
      'Ich war mir sicher, welche der beiden Zusammenfassungen besser ist.',
  },
  {
    id: 'q2',
    question:
      'Meine Entscheidung wurde durch die Qualität der Zusammenfassung beeinflusst.',
  },
  {
    id: 'q3',
    question:
      'Ich habe bei meiner Entscheidung auf bestimmte Formulierungen oder Sätze geachtet.',
  },
  {
    id: 'q4',
    question:
      'Ich konnte die Unterschiede zwischen den beiden Zusammenfassungen gut erkennen.',
  },
  {
    id: 'q5',
    question:
      'Die Entscheidung zwischen den beiden Zusammenfassungen fiel mir leicht.',
  },
];

export default function SummaryComparisonSurvey() {
  const [, navigate] = useLocation();

  const [selectedSummary, setSelectedSummary] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [comment, setComment] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isComplete = useMemo(
    () =>
      selectedSummary != null && QUESTIONS.every((q) => answers[q.id] != null),
    [selectedSummary, answers]
  );

  const handleAnswerChange = (id: string, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    setSubmitAttempted(true);

    if (!isComplete || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await logAction('summary_comparison_submit', {
        selectedSummary,
        answers,
        comment,
      });

      navigate('/about'); // or wherever "done" should go
    } catch (err) {
      console.error('Summary comparison survey submit failed', err);
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
          pb: 14,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Zusammenfassungen vergleichen
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Lesen Sie beide Zusammenfassungen und wählen Sie anschließend die
          Zusammenfassung aus, die Sie für besser halten.
        </Typography>

        {/* Summary selection */}
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
          Welche Zusammenfassung finden Sie besser?
        </Typography>

        <RadioGroup
          value={selectedSummary ?? ''}
          onChange={(event) => setSelectedSummary(event.target.value)}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: '1fr 1fr',
              },
              gap: 2,
            }}
          >
            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                borderRadius: 2,
                borderColor:
                  selectedSummary === 'summary_a' ? 'primary.main' : 'divider',
                borderWidth: selectedSummary === 'summary_a' ? 2 : 1,
                transition: 'border-color 0.2s',
                height: '100%',
              }}
            >
              <FormControlLabel
                value="summary_a"
                control={<Radio />}
                label={
                  <Typography sx={{ fontWeight: 600 }}>
                    Zusammenfassung A
                  </Typography>
                }
                sx={{
                  alignItems: 'flex-start',
                  m: 0,
                }}
              />

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 1.5,
                  ml: 4.5,
                  whiteSpace: 'pre-line',
                  lineHeight: 1.7,
                }}
              >
                {SUMMARY_A}
              </Typography>
            </Paper>

            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                borderRadius: 2,
                borderColor:
                  selectedSummary === 'summary_b' ? 'primary.main' : 'divider',
                borderWidth: selectedSummary === 'summary_b' ? 2 : 1,
                transition: 'border-color 0.2s',
                height: '100%',
              }}
            >
              <FormControlLabel
                value="summary_b"
                control={<Radio />}
                label={
                  <Typography sx={{ fontWeight: 600 }}>
                    Zusammenfassung B
                  </Typography>
                }
                sx={{
                  alignItems: 'flex-start',
                  m: 0,
                }}
              />

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 1.5,
                  ml: 4.5,
                  whiteSpace: 'pre-line',
                  lineHeight: 1.7,
                }}
              >
                {SUMMARY_B}
              </Typography>
            </Paper>
          </Box>
        </RadioGroup>
        {submitAttempted && !selectedSummary && (
          <Typography
            variant="caption"
            color="error"
            sx={{ mt: 1, display: 'block' }}
          >
            Bitte wählen Sie eine der beiden Zusammenfassungen aus.
          </Typography>
        )}

        {/* Likert questions */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Ihre Entscheidung
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Bitte bewerten Sie die folgenden Aussagen von 1 (stimme überhaupt
            nicht zu) bis 5 (stimme voll und ganz zu).
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
        </Box>

        {/* Additional comment */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Zusätzliche Anmerkungen
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Gibt es noch etwas, das Sie zu Ihrer Entscheidung oder zu den beiden
            Zusammenfassungen anmerken möchten?
          </Typography>

          <TextField
            fullWidth
            multiline
            minRows={4}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Ihre Anmerkung (optional)"
          />
        </Box>

        {submitAttempted && !isComplete && (
          <Typography
            variant="caption"
            color="error"
            sx={{ mt: 2, display: 'block' }}
          >
            Bitte wählen Sie eine Zusammenfassung aus und beantworten Sie alle
            Fragen, bevor Sie die Umfrage abschicken.
          </Typography>
        )}
      </Box>

      {/* Submit button */}
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
