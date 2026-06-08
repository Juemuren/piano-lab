import Plot2D from '../../../shared/Plot2D';

interface ModulationCurvePreviewProps {
  title: string;
  time: number[];
  values: number[];
  valueSuffix?: string;
}

function ModulationCurvePreview({
  title,
  time,
  values,
  valueSuffix,
}: ModulationCurvePreviewProps) {
  return (
    <details open className="my-2">
      <summary className="font-bold my-2">{title}</summary>
      <Plot2D
        data={[
          {
            x: time,
            y: values,
            mode: 'lines',
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
