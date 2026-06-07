import { useTranslation } from 'react-i18next';
import useAudioAnalysis from '../../../hooks/synth/useAudioAnalysis';

function Analysis() {
  const { t } = useTranslation('synth');
  const { frequencyCanvasRef, timeDomainCanvasRef } = useAudioAnalysis();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-2">
        <h3 className="font-bold">{t('analysis.frequencyDomain')}</h3>
        <canvas
          ref={frequencyCanvasRef}
          className="block w-full h-36 rounded-lg border border-app-border dark:border-app-border-dark"
        />
      </div>
      <div className="space-y-2">
        <h3 className="font-bold">{t('analysis.timeDomain')}</h3>
        <canvas
          ref={timeDomainCanvasRef}
          className="block w-full h-36 rounded-lg border border-app-border dark:border-app-border-dark"
        />
      </div>
    </div>
  );
}

export default Analysis;
