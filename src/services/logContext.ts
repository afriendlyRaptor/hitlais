export type LogContext = {
  step: string | null;
  taskId: string | null;
  documentId: number | null;
};

let context: LogContext = { step: null, taskId: null, documentId: null };

/** Set by the study flow; attached to every log entry. */
export function setLogContext(next: LogContext) {
  context = next;
}

export function getLogContext(): LogContext {
  return context;
}
