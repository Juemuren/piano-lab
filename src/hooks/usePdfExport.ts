import { useCallback } from 'react';
import { renderAbc } from 'abcjs';

const PRINTING_CLASS = 'abcjs-printing';
const PRINT_TARGET_CLASS = 'abcjs-print-target';

function usePdfExport(abcContent: string) {
  return useCallback(() => {
    const printTarget = document.createElement('div');
    printTarget.className = PRINT_TARGET_CLASS;
    printTarget.setAttribute('aria-hidden', 'true');
    document.body.appendChild(printTarget);

    renderAbc(printTarget, abcContent, {
      responsive: 'resize',
      oneSvgPerLine: true,
    });

    const cleanup = () => {
      document.body.classList.remove(PRINTING_CLASS);
      printTarget.remove();
      window.removeEventListener('focus', cleanup);
    };

    window.addEventListener('focus', cleanup);
    document.body.classList.add(PRINTING_CLASS);

    requestAnimationFrame(() => {
      window.print();
    });
  }, [abcContent]);
}

export default usePdfExport;
