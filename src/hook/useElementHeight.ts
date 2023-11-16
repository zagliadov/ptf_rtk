import { useState, useEffect, RefObject } from "react";

/**
 * A custom hook to get the height of a referenced DOM element.
 *
 * @param ref - The React ref object pointing to the DOM element.
 * @param offset - Optional number representing the offset to subtract from the height.
 * @returns The height of the element as a string (e.g., "200px").
 */
export const useElementHeight = (
  ref: RefObject<HTMLElement>,
  offset: number = 16.5
) => {
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        setHeight(`${ref.current.clientHeight - offset}px`);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, [ref, offset]);

  return height;
};
