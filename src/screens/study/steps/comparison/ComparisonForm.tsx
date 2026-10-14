import { useMemo, useState } from 'react';
import { Box, RadioGroup, Typography } from '@mui/material';
import {
  QuestionnaireItems,
  StepHeader,
  StepLayout,
  ValidationMessage,
} from '~/components/study';
import { COMPARISON, getQuestionnaire } from '~/config';
import { useQuestionnaireForm } from '~/hooks';
import { arrangeSummaries } from '~/lib/comparison';
import { logAction } from '~/services';
import { SummaryChoiceCard } from './SummaryChoiceCard';

type Props = {
  userId: string;
  generatedSummary: string;
  referenceSummary: string;
  onFinish: () => void;
};

export function ComparisonForm({
  userId,
  generatedSummary,
  referenceSummary,
  onFinish,
}: Props) {
  const { title, description, items } = getQuestionnaire(
    COMPARISON.questionnaireId
  );

  const options = useMemo(
    () => arrangeSummaries(userId, generatedSummary, referenceSummary),
    [userId, generatedSummary, referenceSummary]
  );

  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

  const form = useQuestionnaireForm({
    items,
    isExtraComplete: selectedPosition != null,
    onSubmit: (answers) => {
      logAction('comparison_submit', {
        selected_position: selectedPosition,
        selected_source: options.find((o) => o.position === selectedPosition)
          ?.source,
        generated_position: options.find((o) => o.source === 'generated')
          ?.position,
        answers,
      });
      onFinish();
    },
  });

  return (
    <StepLayout
      onSubmit={form.handleSubmit}
      isSubmitting={form.isSubmitting}
      submitLabel="Abschließen"
    >
      <StepHeader title={title} description={description} />

      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
        Welche Zusammenfassung finden Sie besser?
      </Typography>

      <RadioGroup
        value={selectedPosition ?? ''}
        onChange={(event) => setSelectedPosition(event.target.value)}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
          }}
        >
          {options.map((option) => (
            <SummaryChoiceCard
              key={option.position}
              option={option}
              selected={selectedPosition === option.position}
            />
          ))}
        </Box>
      </RadioGroup>

      {form.submitAttempted && selectedPosition == null && (
        <ValidationMessage>
          Bitte wählen Sie eine der beiden Zusammenfassungen aus.
        </ValidationMessage>
      )}

      <Box sx={{ mt: 5 }}>
        <QuestionnaireItems
          items={items}
          answers={form.answers}
          onChange={form.setAnswer}
        />
      </Box>

      {form.submitAttempted && !form.isComplete && (
        <ValidationMessage mt={2}>
          Bitte wählen Sie eine Zusammenfassung aus und beantworten Sie alle
          Fragen, bevor Sie fortfahren.
        </ValidationMessage>
      )}
    </StepLayout>
  );
}
