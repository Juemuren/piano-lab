import { useLayoutEffect, useRef, useState } from 'react';

function useElementWidth<T extends HTMLElement>() {
  const elementRef = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const updateWidth = () => {
      setWidth(element.getBoundingClientRect().width);
    };
    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, []);

  return {
    elementRef,
    width,
  };
}

export default useElementWidth;
