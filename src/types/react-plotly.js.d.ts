declare module 'react-plotly.js/plot3d' {
  import type { PlotParams } from 'react-plotly.js';

  const Plot3D: React.ComponentType<PlotParams>;
  export default Plot3D;
}

declare module 'react-plotly.js/plot2d' {
  import type { PlotParams } from 'react-plotly.js';

  const Plot2D: React.ComponentType<PlotParams>;
  export default Plot2D;
}
