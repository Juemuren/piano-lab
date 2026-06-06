import PlotlyScatter from 'react-plotly.js/scatter';
import type { PlotParams } from 'react-plotly.js';
import type { Layout, LayoutAxis } from 'plotly.js';
import useElementWidth from '../../hooks/useElementWidth';

type ScatterProps = {
  data: PlotParams['data'];
  layout?: Partial<Layout>;
  xaxis?: Partial<LayoutAxis>;
  yaxis?: Partial<LayoutAxis>;
};

const defaultAxis: Partial<LayoutAxis> = {
  fixedrange: true,
  gridcolor: 'rgba(128,128,128,0.25)',
};

function Scatter({ data, layout, xaxis, yaxis }: ScatterProps) {
  const { elementRef, width } = useElementWidth<HTMLDivElement>();

  return (
    <div ref={elementRef} className="w-full">
      {width > 0 && (
        <PlotlyScatter
          data={data}
          layout={{
            autosize: true,
            margin: { t: 40, r: 40, b: 40, l: 40 },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            ...layout,
            xaxis: {
              ...defaultAxis,
              ...layout?.xaxis,
              ...xaxis,
            },
            yaxis: {
              ...defaultAxis,
              ...layout?.yaxis,
              ...yaxis,
            },
          }}
          config={{
            autosizable: true,
            displayModeBar: false,
          }}
          style={{
            width: `${width}px`,
            height: '100%',
          }}
          useResizeHandler
        />
      )}
    </div>
  );
}

export default Scatter;
