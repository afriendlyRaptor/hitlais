import { useState } from 'react';
import { getDocument } from '~/services';

export function useDocument() {
  const [document, setDocument] = useState<DocumentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function loadDocument(id: number) {
    setIsLoading(true);

    try {
      const response = await getDocument(id);

      setDocument(response.result);

      return response.result;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    document,
    isLoading,
    loadDocument,
  };
}
