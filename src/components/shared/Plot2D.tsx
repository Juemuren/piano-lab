import type { Layout, LayoutAxis } from 'plotly.js';
import type { PlotParams } from 'react-plotly.js';
import Plotly2D from 'react-plotly.js/plot2d';
import useElementWidth from '../../hooks/useElementWidth';

type Plot2DProps = {
  data: PlotParams['data'];
  layout?: Partial<Layout>;
  xaxis?: Partial<LayoutAxis>;
  yaxis?: Partial<LayoutAxis>;
};

const defaultAxis: Partial<LayoutAxis> = {
  fixedrange: true,
  gridcolor: 'rgba(128,128,128,0.25)',
};

function Plot2D({ data, layout, xaxis, yaxis }: Plot2DProps) {
  const { elementRef, width } = useElementWidth<HTMLDivElement>();

  return (
    <div ref={elementRef} className="w-full">
      {width > 0 && (
        <Plotly2D
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

export default Plot2D;
