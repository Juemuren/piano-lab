import type { TransferFunction, Spectrum } from '../../types';
import { getSpectrumPreset, getTransferFunctionPreset } from './AudioPresets';
import {
  DEFAULT_SPECTRUM_TYPE,
  DEFAULT_SPECTRUM_DECAY_RATE,
  DEFAULT_SPECTRUM_POWER_EXPONENT,
  DEFAULT_SPECTRUM_STRIKE_POINT,
  DEFAULT_TF_TYPE,
  DEFAULT_TF_ATTENUATION,
  DEFAULT_TF_BASE_FREQUENCY_HZ,
  DEFAULT_TF_DELAY_MS,
  DEFAULT_TF_MAX_FREQUENCY_HZ,
  DEFAULT_TF_MIN_FREQUENCY_HZ,
  DEFAULT_SYNTH_OSCILLATOR_TYPE,
  DEFAULT_SYNTH_HARMONIC_COUNT,
  DEFAULT_ENVELOPE_VOLUME_RATIO,
  DEFAULT_ENVELOPE_ATTACK_TIME_SECONDS,
  DEFAULT_ENVELOPE_DECAY_TIME_SECONDS,
  DEFAULT_ENVELOPE_RELEASE_TIME_SECONDS,
  DEFAULT_ENVELOPE_SUSTAIN_GAIN,
  DEFAULT_ENVELOPE_SILENCE_GAIN,
} from '../../constants';

export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private harmonicCount: number = DEFAULT_SYNTH_HARMONIC_COUNT;
  private spectrum: Spectrum = getSpectrumPreset(
    DEFAULT_SPECTRUM_TYPE,
    DEFAULT_SPECTRUM_STRIKE_POINT,
    DEFAULT_SPECTRUM_DECAY_RATE,
    DEFAULT_SPECTRUM_POWER_EXPONENT,
    this.harmonicCount,
  );
  private transferFunction: TransferFunction = getTransferFunctionPreset(
    DEFAULT_TF_TYPE,
    DEFAULT_TF_DELAY_MS,
    DEFAULT_TF_ATTENUATION,
    DEFAULT_TF_MIN_FREQUENCY_HZ,
    DEFAULT_TF_MAX_FREQUENCY_HZ,
    DEFAULT_TF_BASE_FREQUENCY_HZ,
    this.harmonicCount,
  );

  private oscillatorType: OscillatorType = DEFAULT_SYNTH_OSCILLATOR_TYPE;
  private volumeRatio: number = DEFAULT_ENVELOPE_VOLUME_RATIO;
  private attackTime: number = DEFAULT_ENVELOPE_ATTACK_TIME_SECONDS;
  private decayTime: number = DEFAULT_ENVELOPE_DECAY_TIME_SECONDS;
  private releaseTime: number = DEFAULT_ENVELOPE_RELEASE_TIME_SECONDS;
  private sustainGain: number = DEFAULT_ENVELOPE_SUSTAIN_GAIN;
  private silenceGain: number = DEFAULT_ENVELOPE_SILENCE_GAIN;

  init() {
    if (!this.audioContext) {
      this.audioContext = new AudioContext({ latencyHint: 'playback' });
    }
  }

  setSpectrum(spectrum: Spectrum) {
    this.spectrum = spectrum;
  }

  getSpectrum(): Spectrum {
    return this.spectrum;
  }

  setTransferFunction(tf: TransferFunction) {
    this.transferFunction = tf;
  }

  getTransferFunction(): TransferFunction {
    return this.transferFunction;
  }

  getHarmonicCount(): number {
    return this.harmonicCount;
  }

  setHarmonicCount(value: number) {
    this.harmonicCount = value;
  }

  getOscillatorType(): OscillatorType {
    return this.oscillatorType;
  }

  setOscillatorType(type: OscillatorType) {
    this.oscillatorType = type;
  }

  getVolume(): number {
    return this.volumeRatio;
  }

  setVolume(value: number) {
    this.volumeRatio = value;
  }

  getAttackTime(): number {
    return this.attackTime;
  }

  setAttackTime(value: number) {
    this.attackTime = value;
  }

  getDecayTime(): number {
    return this.decayTime;
  }

  setDecayTime(value: number) {
    this.decayTime = value;
  }

  getReleaseTime(): number {
    return this.releaseTime;
  }

  setReleaseTime(value: number) {
    this.releaseTime = value;
  }

  getSustainGain(): number {
    return this.sustainGain;
  }

  setSustainGain(value: number) {
    this.sustainGain = value;
  }

  getSilenceGain(): number {
    return this.silenceGain;
  }

  setSilenceGain(value: number) {
    this.silenceGain = value;
  }

  private async ensureAudioContextRunning(): Promise<void> {
    if (!this.audioContext) {
      this.init();
    }
    if (!this.audioContext) {
      return;
    }
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    if (this.audioContext.state === 'closed') {
      this.init();
    }
  }

  getBaseFreq(pitch: number, cents: number = 0) {
    return 440 * Math.pow(2, (pitch + cents / 100 - 69) / 12);
  }

  getTargetGain(timbreAmp: number, transferMag: number, volume: number) {
    return timbreAmp * transferMag * (volume / 127) * this.volumeRatio;
  }

  getDelaySeconds(phaseDeg: number, freq: number) {
    return phaseDeg / (360 * freq);
  }

  async playNote(
    pitch: number,
    duration: number,
    volume: number = 100,
    cents: number = 0,
  ) {
    await this.ensureAudioContextRunning();
    if (!this.audioContext) return;

    const baseFreq = this.getBaseFreq(pitch, cents);
    const harmonics = this.spectrum.amplitudes.length;
    const transferFunction = this.transferFunction;
    const { magnitudes, phases } = getTransferFunctionPreset(
      transferFunction.type,
      transferFunction.tau,
      transferFunction.alpha,
      transferFunction.minFreq,
      transferFunction.maxFreq,
      baseFreq,
      harmonics,
    );

    for (let n = 1; n <= harmonics; n++) {
      const freq = baseFreq * n;

      const timbreAmp = this.spectrum.amplitudes[n - 1] || 0;
      const transferMag = magnitudes[n - 1] || 0;
      const targetGain = this.getTargetGain(timbreAmp, transferMag, volume);

      const phaseDeg = phases[n - 1] || 0;
      const delaySeconds = this.getDelaySeconds(phaseDeg, freq);

      const now = this.audioContext.currentTime;
      const startTime = Math.max(0, now + delaySeconds);
      const attackEnd = startTime + this.attackTime;
      const decayEnd = attackEnd + this.decayTime / Math.sqrt(n);
      const sustainEnd = decayEnd + duration;
      const stopTime = sustainEnd + this.releaseTime / Math.sqrt(n);

      const attackGain = Math.max(targetGain, this.silenceGain);
      const decayGain = Math.max(
        attackGain * this.sustainGain,
        this.silenceGain,
      );
      const sustainGain = Math.max(
        decayGain / Math.sqrt(1 + n),
        this.silenceGain,
      );

      const oscillatorNode = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillatorNode.type = this.oscillatorType;
      oscillatorNode.frequency.setValueAtTime(freq, startTime);

      gainNode.gain.setValueAtTime(this.silenceGain, startTime);
      gainNode.gain.exponentialRampToValueAtTime(attackGain, attackEnd);
      gainNode.gain.exponentialRampToValueAtTime(decayGain, decayEnd);
      gainNode.gain.exponentialRampToValueAtTime(sustainGain, sustainEnd);
      gainNode.gain.exponentialRampToValueAtTime(this.silenceGain, stopTime);

      oscillatorNode.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillatorNode.onended = () => {
        oscillatorNode.disconnect();
        gainNode.disconnect();
      };

      oscillatorNode.start(startTime);
      oscillatorNode.stop(stopTime);
    }
  }
}
