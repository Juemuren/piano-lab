import { useTranslation } from 'react-i18next';
import useAudioAnalysis from '../../../hooks/synth/useAudioAnalysis';

function Analysis() {
  const { t } = useTranslation('synth');
  const { frequencyCanvasRef, timeDomainCanvasRef } = useAudioAnalysis();

  return (
    <div className="space-y-4">
      <details open className="space-y-2">
        <summary className="font-bold">{t('analysis.frequencyDomain')}</summary>
        <canvas
          ref={frequencyCanvasRef}
          className="block w-full h-36 rounded-lg border border-app-border dark:border-app-border-dark"
        />
      </details>
      <details open className="space-y-2">
        <summary className="font-bold">{t('analysis.timeDomain')}</summary>
        <canvas
          ref={timeDomainCanvasRef}
          className="block w-full h-36 rounded-lg border border-app-border dark:border-app-border-dark"
        />
      </details>
    </div>
  );
}

export default Analysis;
