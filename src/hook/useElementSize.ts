import { useState, useEffect, useRef } from "react";

/**
 * Custom hook to track the size of a specific DOM element.
 * @returns Ref object for the element and its current size.
 */
export const useElementSize = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0].target) {
        const { width, height } = entries[0].contentRect;
        setSize({ width, height });
      }
    });
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return { elementRef, size };
};
