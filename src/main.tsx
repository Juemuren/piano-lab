import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppSettingsProvider } from './contexts/appSettings';
import { AbcContentProvider } from './contexts/abcContent';
import { MidiControlProvider } from './contexts/midiControl';
import { PlayingNotesProvider } from './contexts/playingNotes';
import { SynthEngineProvider } from './contexts/synthEngine';
import App from './App.tsx';
import 'katex/dist/katex.min.css';
import './i18n';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppSettingsProvider>
      <AbcContentProvider>
        <PlayingNotesProvider>
          <SynthEngineProvider>
            <MidiControlProvider>
              <App />
            </MidiControlProvider>
          </SynthEngineProvider>
        </PlayingNotesProvider>
      </AbcContentProvider>
    </AppSettingsProvider>
  </StrictMode>,
);
