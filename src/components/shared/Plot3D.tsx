import type { Layout } from 'plotly.js';
import type { PlotParams } from 'react-plotly.js';
import Plotly3D from 'react-plotly.js/plot3d';
import useElementWidth from '../../hooks/useElementWidth';

type Plot3DProps = {
  data: PlotParams['data'];
  layout?: Partial<Layout>;
};

function Plot3D({ data, layout }: Plot3DProps) {
  const { elementRef, width } = useElementWidth<HTMLDivElement>();

  return (
    <div ref={elementRef} className="w-full">
      {width > 0 && (
        <Plotly3D
          data={data}
          layout={{
            autosize: true,
            margin: { t: 20, r: 20, b: 20, l: 20 },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            ...layout,
          }}
          config={{
            autosizable: true,
            displayModeBar: false,
          }}
          style={{
            width: `${width}px`,
            height: '360px',
          }}
          useResizeHandler
        />
      )}
    </div>
  );
}

export default Plot3D;
