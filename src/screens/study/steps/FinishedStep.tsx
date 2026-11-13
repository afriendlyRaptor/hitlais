import { StepHeader, StepLayout } from '~/components/study';

export function FinishedStep() {
  return (
    <StepLayout>
      <StepHeader
        title="Vielen Dank!"
        description="Sie haben die Studie erfolgreich abgeschlossen! 
        Vielen Dank für Ihre Mühen.
        Sie können dieses Fenster jetzt schließen."
      />
    </StepLayout>
  );
}
