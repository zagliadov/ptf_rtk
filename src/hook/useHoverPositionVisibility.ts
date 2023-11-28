import { useState, MouseEvent } from "react";

interface UseHoverPositionVisibilityProps<IDetail> {
  setDetail?: (detail: IDetail | null) => void;
}

/**
 * A custom React hook to manage the visibility and position of a hoverable component.
 * It can optionally set detailed information when the mouse enters the element.
 *
 * @template IDetail The type of detail object to be set on mouse enter.
 * @param setDetail - Optional function to set the detail object when mouse enters.
 * @returns An object containing the following:
 *          - isVisible: A boolean indicating if the hover element is visible.
 *          - position: An object containing the top and left coordinates for the hover element.
 *          - handleMouseEnter: A function to call when the mouse enters the hoverable element.
 *                             It sets the position, makes the hover element visible, and optionally sets the detail.
 *          - handleMouseLeave: A function to call when the mouse leaves the hoverable element.
 *                              It hides the hover element and optionally resets the detail.
 */

export const useHoverPositionVisibility = <IDetail extends unknown>({
  setDetail,
}: UseHoverPositionVisibilityProps<IDetail>) => {
  // State management for visibility and position of the hover element
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  // Handle mouse entering the element
  const handleMouseEnter = (
    event: MouseEvent<HTMLElement>,
    detail?: IDetail
  ) => {
    // Set the position of the hover element based on the event target
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({
      top: rect.top + window.scrollY,
      left: rect.right + window.scrollX,
    });

    // Optionally set the detail data
    if (setDetail && detail) {
      setDetail(detail);
    }
    setIsVisible(true);
  };

  // Handle mouse leaving the element
  const handleMouseLeave = () => {
    setIsVisible(false);
    // Optionally reset the detail data
    if (setDetail) {
      setDetail(null);
    }
  };

  return { isVisible, position, handleMouseEnter, handleMouseLeave };
};
