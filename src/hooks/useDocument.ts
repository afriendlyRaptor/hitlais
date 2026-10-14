import { useCallback, useState } from 'react';
import { Alertify, getDocument, type DocumentResult } from '~/services';

export function useDocument() {
  const [document, setDocument] = useState<DocumentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadDocument = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getDocument(id);

      setDocument(response.result);
    } catch (err) {
      console.error('Failed to load document:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      Alertify.error('Das Dokument konnte nicht geladen werden.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    document,
    isLoading,
    error,
    loadDocument,
  };
}
