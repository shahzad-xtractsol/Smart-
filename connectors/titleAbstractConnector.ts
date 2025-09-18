import React, { useEffect } from 'react';
import { useAuditor, useRecorder } from '../hooks/useTitleAbstract';

/**
 * Tiny non-UI connector that demonstrates usage of the hooks. Do not import in full-version files.
 * The UI should call the hooks directly; this file is an example and quick integration point.
 */
export const TitleAbstractConnector: React.FC<{ titleSearchId: string; onData?: (data: any) => void }> = ({ titleSearchId, onData }) => {
  const { fetchAuditor, loading: loadingAuditor } = useAuditor(titleSearchId);
  const { fetchRecorder, loading: loadingRecorder } = useRecorder(titleSearchId);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const auditor = await fetchAuditor({});
        const recorder = await fetchRecorder({}, { page: 1, limit: 20 });
        if (!mounted) return;
        onData && onData({ auditor, recorder });
      } catch (err) {
        // swallow - caller can pass onData to handle errors
      }
    })();
    return () => {
      mounted = false;
    };
  }, [titleSearchId, fetchAuditor, fetchRecorder, onData]);

  return null;
};

export default TitleAbstractConnector;
