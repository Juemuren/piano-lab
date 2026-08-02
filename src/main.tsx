import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { SynthEngineProvider } from './contexts/synthEngine';
import 'katex/dist/katex.min.css';
import './i18n';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SynthEngineProvider>
      <App />
    </SynthEngineProvider>
  </StrictMode>,
);
