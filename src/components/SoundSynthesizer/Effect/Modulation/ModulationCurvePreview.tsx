import Plot2D from '../../../shared/Plot2D';

interface ModulationCurvePreviewProps {
  time: number[];
  title: string;
  valueSuffix?: string;
  values: number[];
}

function ModulationCurvePreview({
  title,
  time,
  values,
  valueSuffix,
}: ModulationCurvePreviewProps) {
  return (
    <details className="my-2" open>
      <summary className="font-bold my-2">{title}</summary>
      <Plot2D
        data={[
          {
            mode: 'lines',
            x: time,
            y: values,
          },
        ]}
        xaxis={{
          range: [0, 1],
          ticksuffix: 's',
        }}
        yaxis={{
          ticksuffix: valueSuffix,
        }}
      />
    </details>
  );
}

export default ModulationCurvePreview;
