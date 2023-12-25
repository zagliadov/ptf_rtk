import { useEffect, useState } from "react";

/**
 * Custom hook to determine if the number of visible filter blocks is less than the total number of filters.
 * This can be used to control the visibility or enabled state of UI elements based on the visibility of filter blocks.
 *
 * @param {number} visibleBlocks - The number of filter blocks currently visible in the UI.
 * @param {number} allFiltersLength - The total number of filters available.
 * @returns {{ disabled: boolean, visibleLength: number }} An object containing:
 *           - `disabled`: A boolean indicating whether certain UI elements should be disabled based on the visibility of filter blocks.
 *           - `visibleLength`: The actual number of visible filter blocks.
 */
const useCheckVisible = (
  visibleBlocks: number,
  allFiltersLength: number
): { disabled: boolean; visibleLength: number } => {
  const [disabled, setDisabled] = useState<boolean>(false);
  const [visibleLength, setVisibleLength] = useState<number>(0);

  useEffect(() => {
    // Select all filter blocks with IDs starting with 'filter-block-'
    const blocks = document.querySelectorAll('[id^="filter-block-"]');
    // Disable functionality if the number of visible blocks is less than the total number of filters
    setDisabled(blocks.length < allFiltersLength);
    setVisibleLength(blocks.length);
  }, [visibleBlocks, allFiltersLength]);

  return { disabled, visibleLength };
};

export default useCheckVisible;
