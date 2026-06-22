import type { Layout } from 'plotly.js';
import type { PlotParams } from 'react-plotly.js';
import Plotly3D from 'react-plotly.js/plot3d';
import useElementWidth from '../../hooks/useElementWidth';

interface Plot3DProps {
  data: PlotParams['data'];
  layout?: Partial<Layout>;
}

function Plot3D({ data, layout }: Plot3DProps) {
  const { elementRef, width } = useElementWidth<HTMLDivElement>();

  return (
    <div className="w-full" ref={elementRef}>
      {width > 0 && (
        <Plotly3D
          config={{
            autosizable: true,
            displayModeBar: false,
          }}
          data={data}
          layout={{
            autosize: true,
            margin: { b: 20, l: 20, r: 20, t: 20 },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            ...layout,
          }}
          style={{
            height: '360px',
            width: `${width}px`,
          }}
          useResizeHandler
        />
      )}
    </div>
  );
}

export default Plot3D;
