import { useEffect, useRef } from 'react';
import { useSynthEngine } from '../../contexts/synthEngine';

const CANVAS_HEIGHT = 140;
const FREQUENCY_BAR_GAP = 1;
const FREQUENCY_MIN_BAR_WIDTH = 1;

function getThemeColor(name: string) {
  const isDark = document.documentElement.classList.contains('dark');
  const themeName = isDark ? `${name}-dark` : name;
  const themedValue = getComputedStyle(document.documentElement)
    .getPropertyValue(themeName)
    .trim();

  if (themedValue) return themedValue;

  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

function resizeCanvas(canvas: HTMLCanvasElement) {
  const pixelRatio = window.devicePixelRatio || 1;
  const width = Math.max(canvas.clientWidth, 1);
  const height = CANVAS_HEIGHT;

  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
}

function drawBackground(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  const backgroundColor = getThemeColor('--color-app-mantle');
  const borderColor = getThemeColor('--color-app-border');

  context.clearRect(0, 0, width, height);
  context.globalAlpha = 0.35;
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, width, height);
  context.globalAlpha = 1;
  context.strokeStyle = borderColor;
  context.lineWidth = 1;

  for (let index = 1; index < 4; index += 1) {
    const y = (height / 4) * index;
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }
}

function drawFrequency(
  canvas: HTMLCanvasElement,
  analyserNode: AnalyserNode,
  data: Uint8Array<ArrayBuffer>,
) {
  const context = canvas.getContext('2d');
  if (!context) return;

  const { width, height } = canvas;
  const accentColor = getThemeColor('--color-app-info');
  const tipColor = getThemeColor('--color-app-tip');
  const maxBarCount = Math.floor(
    width / (FREQUENCY_MIN_BAR_WIDTH + FREQUENCY_BAR_GAP),
  );
  const barCount = Math.max(Math.min(data.length, maxBarCount), 1);
  const barWidth =
    (width - FREQUENCY_BAR_GAP * Math.max(barCount - 1, 0)) / barCount;

  analyserNode.getByteFrequencyData(data);
  drawBackground(context, width, height);

  for (let index = 0; index < barCount; index += 1) {
    const start = Math.floor((index / barCount) * data.length);
    const end = Math.max(
      Math.floor(((index + 1) / barCount) * data.length),
      start + 1,
    );
    let peak = 0;

    for (let dataIndex = start; dataIndex < end; dataIndex += 1) {
      peak = Math.max(peak, data[dataIndex]);
    }

    const magnitude = peak / 255;
    const barHeight = magnitude * height;
    const hueMix = index / barCount;

    context.fillStyle = hueMix > 0.5 ? tipColor : accentColor;
    context.fillRect(
      index * (barWidth + FREQUENCY_BAR_GAP),
      height - barHeight,
      barWidth,
      barHeight,
    );
  }
}

function drawTimeDomain(
  canvas: HTMLCanvasElement,
  analyserNode: AnalyserNode,
  data: Uint8Array<ArrayBuffer>,
) {
  const context = canvas.getContext('2d');
  if (!context) return;

  const { width, height } = canvas;
  const accentColor = getThemeColor('--color-app-warning');
  const sliceWidth = width / Math.max(data.length - 1, 1);

  analyserNode.getByteTimeDomainData(data);
  drawBackground(context, width, height);

  context.lineWidth = Math.max(window.devicePixelRatio || 1, 1) * 2;
  context.strokeStyle = accentColor;
  context.beginPath();

  for (let index = 0; index < data.length; index += 1) {
    const x = index * sliceWidth;
    const y = (data[index] / 255) * height;

    if (index === 0) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }
  }

  context.stroke();
}

function useAudioAnalysis() {
  const synthEngine = useSynthEngine();
  const frequencyCanvasRef = useRef<HTMLCanvasElement>(null);
  const timeDomainCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const frequencyCanvas = frequencyCanvasRef.current;
    const timeDomainCanvas = timeDomainCanvasRef.current;
    const analyserNode = synthEngine.getAnalyserNode();

    if (!frequencyCanvas || !timeDomainCanvas || !analyserNode) return;

    const frequencyData = new Uint8Array(
      new ArrayBuffer(analyserNode.frequencyBinCount),
    );
    const timeDomainData = new Uint8Array(
      new ArrayBuffer(analyserNode.fftSize),
    );
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas(frequencyCanvas);
      resizeCanvas(timeDomainCanvas);
    });
    let animationFrameId = 0;

    resizeCanvas(frequencyCanvas);
    resizeCanvas(timeDomainCanvas);
    resizeObserver.observe(frequencyCanvas);
    resizeObserver.observe(timeDomainCanvas);

    const draw = () => {
      drawFrequency(frequencyCanvas, analyserNode, frequencyData);
      drawTimeDomain(timeDomainCanvas, analyserNode, timeDomainData);
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [synthEngine]);

  return {
    frequencyCanvasRef,
    timeDomainCanvasRef,
  };
}

export default useAudioAnalysis;
