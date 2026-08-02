declare module 'plotly.js/lib/core' {
  import type * as Plotly from 'plotly.js';

  const core: typeof Plotly;
  export default core;
}

declare module 'plotly.js/lib/scatter' {
  import type { PlotlyModule } from 'plotly.js';

  const scatter: PlotlyModule;
  export default scatter;
}

declare module 'plotly.js/lib/scatter3d' {
  import type { PlotlyModule } from 'plotly.js';

  const scatter3d: PlotlyModule;
  export default scatter3d;
}

declare module 'plotly.js/lib/mesh3d' {
  import type { PlotlyModule } from 'plotly.js';

  const mesh3d: PlotlyModule;
  export default mesh3d;
}
