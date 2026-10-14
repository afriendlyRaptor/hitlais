import { StepHeader, StepLayout } from '~/components/study';

export function FinishedStep() {
  return (
    <StepLayout>
      <StepHeader
        title="Vielen Dank!"
        description="Sie haben die Studie abgeschlossen. Sie können dieses Fenster jetzt schließen."
      />
    </StepLayout>
  );
}
