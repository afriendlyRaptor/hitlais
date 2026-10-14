import { useState } from 'react';
import { Box, RadioGroup, TextField, Typography } from '@mui/material';
import { useLocation } from 'wouter';
import {
  LikertScale,
  SurveyHeader,
  SurveyLayout,
  ValidationMessage,
} from '~/components/survey';
import { useSurveyForm } from '~/hooks';
import { ROUTES } from '~/routes/paths';
import { logAction } from '~/services';
import { QUESTIONS, SUMMARY_OPTIONS } from './content';
import { SummaryChoiceCard } from './SummaryChoiceCard';

export default function SummaryComparisonSurvey() {
  const [, navigate] = useLocation();

  const [selectedSummary, setSelectedSummary] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  const {
    answers,
    setAnswer,
    isComplete,
    submitAttempted,
    isSubmitting,
    handleSubmit,
  } = useSurveyForm({
    questions: QUESTIONS,
    isExtraComplete: selectedSummary != null,
    onSubmit: (submittedAnswers) => {
      logAction('summary_comparison_submit', {
        selectedSummary,
        answers: submittedAnswers,
        comment,
      });
      navigate(ROUTES.about); // or wherever "done" should go
    },
  });

  return (
    <SurveyLayout isSubmitting={isSubmitting} onSubmit={handleSubmit}>
      <SurveyHeader
        title="Zusammenfassungen vergleichen"
        description="Lesen Sie beide Zusammenfassungen und wählen Sie anschließend die Zusammenfassung aus, die Sie für besser halten."
      />

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
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
          }}
        >
          {SUMMARY_OPTIONS.map((option) => (
            <SummaryChoiceCard
              key={option.value}
              option={option}
              selected={selectedSummary === option.value}
            />
          ))}
        </Box>
      </RadioGroup>

      {submitAttempted && !selectedSummary && (
        <ValidationMessage>
          Bitte wählen Sie eine der beiden Zusammenfassungen aus.
        </ValidationMessage>
      )}

      {/* Likert questions */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
          Weitere Fragen:
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
            onChange={setAnswer}
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
        <ValidationMessage mt={2}>
          Bitte wählen Sie eine Zusammenfassung aus und beantworten Sie alle
          Fragen, bevor Sie die Umfrage abschicken.
        </ValidationMessage>
      )}
    </SurveyLayout>
  );
}
