import { Hourglass, Signal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useAudioAnalysis from '../../../hooks/synth/useAudioAnalysis';

function Analysis() {
  const { t } = useTranslation('synth');
  const { frequencyCanvasRef, timeDomainCanvasRef } = useAudioAnalysis();

  return (
    <div className="space-y-4">
      <details className="space-y-2" open>
        <summary className="font-bold">
          <span className="inline-flex items-center gap-1">
            <Signal size={16} />
            {t('analysis.frequencyDomain')}
          </span>
        </summary>
        <canvas
          className="block w-full h-36 rounded-lg border border-app-border dark:border-app-border-dark"
          ref={frequencyCanvasRef}
        />
      </details>
      <details className="space-y-2" open>
        <summary className="font-bold">
          <span className="inline-flex items-center gap-1">
            <Hourglass size={16} />
            {t('analysis.timeDomain')}
          </span>
        </summary>
        <canvas
          className="block w-full h-36 rounded-lg border border-app-border dark:border-app-border-dark"
          ref={timeDomainCanvasRef}
        />
      </details>
    </div>
  );
}

export default Analysis;
