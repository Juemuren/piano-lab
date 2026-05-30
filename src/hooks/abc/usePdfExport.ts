import { useCallback } from 'react';
import { renderAbc } from 'abcjs';

const PRINT_TARGET_CLASS = 'abcjs-print-target';

function usePdfExport(abcContent: string) {
  return useCallback(() => {
    const printTarget = document.createElement('div');
    printTarget.className = PRINT_TARGET_CLASS;
    document.body.appendChild(printTarget);

    renderAbc(printTarget, abcContent, {
      responsive: 'resize',
      oneSvgPerLine: true,
    });

    const cleanup = () => {
      printTarget.remove();
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);

    window.print();
  }, [abcContent]);
}

export default usePdfExport;
