import { Box } from '@mui/material';
import type { Answers, QuestionnaireItem } from '~/types';
import { LikertScale } from './LikertScale';
import { OpenQuestion } from './OpenQuestion';

type Props = {
  items: QuestionnaireItem[];
  answers: Answers;
  onChange: (id: string, value: number | string) => void;
  /** Ids of unanswered required questions; these are highlighted. */
  missingIds?: string[];
};

export const questionDomId = (id: string) => `question-${id}`;

/** Ids of unanswered required questions, in display order. */
export function getMissingIds(items: QuestionnaireItem[], answers: Answers) {
  return items
    .filter((item) => {
      const answer = answers[item.id];
      return item.type === 'likert'
        ? typeof answer !== 'number'
        : item.required && !(typeof answer === 'string' && answer.trim());
    })
    .map((item) => item.id);
}

export function scrollToQuestion(id: string) {
  document
    .getElementById(questionDomId(id))
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/** Renders Likert and open questions in the order they are defined. */
export function QuestionnaireItems({
  items,
  answers,
  onChange,
  missingIds = [],
}: Props) {
  return (
    <>
      {items.map((item) => {
        const answer = answers[item.id];
        const missing = missingIds.includes(item.id);

        return (
          // scrollMarginTop keeps the question clear of the app bar
          <Box
            key={item.id}
            id={questionDomId(item.id)}
            sx={{ scrollMarginTop: 96 }}
          >
            {item.type === 'likert' ? (
              <LikertScale
                id={item.id}
                question={item.question}
                lowLabel={item.lowLabel}
                highLabel={item.highLabel}
                value={typeof answer === 'number' ? answer : null}
                error={missing}
                onChange={onChange}
              />
            ) : (
              <OpenQuestion
                id={item.id}
                question={item.question}
                required={item.required}
                value={typeof answer === 'string' ? answer : ''}
                error={missing}
                onChange={onChange}
              />
            )}
          </Box>
        );
      })}
    </>
  );
}
