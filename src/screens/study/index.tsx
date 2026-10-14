import { Redirect } from 'wouter';
import { useUserId } from '~/hooks';
import { ROUTES } from '~/routes/paths';
import { StudyFlow } from './StudyFlow';

/** Route entry: the study needs a user id. */
export default function Study() {
  const userId = useUserId();

  if (!userId) {
    return <Redirect to={ROUTES.login} replace />;
  }

  return <StudyFlow userId={userId} />;
}
