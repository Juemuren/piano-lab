import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppSettingsProvider } from './contexts/appSettings';
import { MidiControlProvider } from './contexts/midiControl';
import { SynthEngineProvider } from './contexts/synthEngine';
import App from './App.tsx';
import 'katex/dist/katex.min.css';
import './i18n';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppSettingsProvider>
      <SynthEngineProvider>
        <MidiControlProvider>
          <App />
        </MidiControlProvider>
      </SynthEngineProvider>
    </AppSettingsProvider>
  </StrictMode>,
);
