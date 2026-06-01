import { useCallback } from 'react';

function usePdfExport() {
  return useCallback(() => {
    window.print();
  }, []);
}

export default usePdfExport;
