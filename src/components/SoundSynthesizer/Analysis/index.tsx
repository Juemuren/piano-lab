import useAudioAnalysis from '../../../hooks/synth/useAudioAnalysis';

function Analysis() {
  const { frequencyCanvasRef, timeDomainCanvasRef } = useAudioAnalysis();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-2">
        <h3 className="font-bold">频域</h3>
        <canvas
          ref={frequencyCanvasRef}
          className="block w-full h-36 rounded-lg border border-app-border dark:border-app-border-dark"
        />
      </div>
      <div className="space-y-2">
        <h3 className="font-bold">时域</h3>
        <canvas
          ref={timeDomainCanvasRef}
          className="block w-full h-36 rounded-lg border border-app-border dark:border-app-border-dark"
        />
      </div>
    </div>
  );
}

export default Analysis;
