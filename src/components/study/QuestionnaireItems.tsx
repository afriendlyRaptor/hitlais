import type { Answers, QuestionnaireItem } from '~/types';
import { LikertScale } from './LikertScale';
import { OpenQuestion } from './OpenQuestion';

type Props = {
  items: QuestionnaireItem[];
  answers: Answers;
  onChange: (id: string, value: number | string) => void;
};

/** Renders Likert and open questions in the order they are defined. */
export function QuestionnaireItems({ items, answers, onChange }: Props) {
  return (
    <>
      {items.map((item) => {
        const answer = answers[item.id];

        return item.type === 'likert' ? (
          <LikertScale
            key={item.id}
            id={item.id}
            question={item.question}
            lowLabel={item.lowLabel}
            highLabel={item.highLabel}
            value={typeof answer === 'number' ? answer : null}
            onChange={onChange}
          />
        ) : (
          <OpenQuestion
            key={item.id}
            id={item.id}
            question={item.question}
            required={item.required}
            value={typeof answer === 'string' ? answer : ''}
            onChange={onChange}
          />
        );
      })}
    </>
  );
}
