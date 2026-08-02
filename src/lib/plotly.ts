import Plotly from 'plotly.js/lib/core';
import mesh3d from 'plotly.js/lib/mesh3d';
import scatter from 'plotly.js/lib/scatter';
import scatter3d from 'plotly.js/lib/scatter3d';
import createPlotlyComponent from 'react-plotly.js/factory';

Plotly.register([scatter, scatter3d, mesh3d]);

const Plot = createPlotlyComponent(Plotly);

export default Plot;
