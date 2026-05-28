export function getHarmonicLabels(length: number) {
  return Array.from({ length }, (_, index) => (
    <span key={index}>
      f<sub>{index + 1}</sub>
    </span>
  ));
}
