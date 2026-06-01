import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SynthEngineProvider } from './contexts/SynthEngineContext';
import { AppSettingsProvider } from './contexts/AppSettingsContext';
import App from './App.tsx';
import 'katex/dist/katex.min.css';
import './i18n';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppSettingsProvider>
      <SynthEngineProvider>
        <App />
      </SynthEngineProvider>
    </AppSettingsProvider>
  </StrictMode>,
);
