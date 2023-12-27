import { useState, useEffect } from "react";
import { IIFilters } from "src/types";

/**
 * A custom hook for filtering an array of filters (`IIFilters`) based on a search string.
 *
 * @param {IIFilters[]} selectedFilters - An array of filter objects to be searched through.
 * @param {string} searchValue - The search string used to filter the array of filters.
 * @returns {UseSearchResult} An object containing:
 *  - filteredList: The array of filters that match the search string.
 *  - setFilteredList: A function to set the state of the filtered list.
 *
 * @example
 * const { filteredList, setFilteredList } = useSearch(filters, 'searchTerm');
 *
 * filteredList.forEach(filter => {
 *   console.log(filter.name);
 * });
 *
 * You can also manually set the filtered list if required
 * setFilteredList(newFilteredList);
 */

interface UseSearchResult {
  filteredList: IIFilters[];
  setFilteredList: React.Dispatch<React.SetStateAction<IIFilters[]>>;
}
export const useSearch = (
  selectedFilters: IIFilters[],
  searchValue: string
): UseSearchResult => {
  const [filteredList, setFilteredList] = useState<IIFilters[]>([]);
  useEffect(() => {
    const updatedList = selectedFilters.filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredList(updatedList);
  }, [searchValue, selectedFilters]);

  return { filteredList, setFilteredList };
};
