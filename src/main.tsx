import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AbcContentProvider } from './contexts/abcContent';
import { AppSettingsProvider } from './contexts/appSettings';
import { GamepadControlProvider } from './contexts/gamepadControl';
import { MidiControlProvider } from './contexts/midiControl';
import { PlayingNotesProvider } from './contexts/playingNotes';
import { SynthEngineProvider } from './contexts/synthEngine';
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
              <GamepadControlProvider>
                <App />
              </GamepadControlProvider>
            </MidiControlProvider>
          </SynthEngineProvider>
        </PlayingNotesProvider>
      </AbcContentProvider>
    </AppSettingsProvider>
  </StrictMode>,
);
