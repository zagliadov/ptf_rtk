import { useEffect, useState } from "react";
import * as _ from "lodash";
import { IReports } from "src/components/SideMenu/reports";

interface UseSearchResult {
  filteredList: IReports[];
  setFilteredList: React.Dispatch<React.SetStateAction<IReports[]>>;
}
/**
 * Custom hook for searching and filtering reports.
 *
 * This hook takes an array of reports, a search value, and a resource filter.
 * It returns a filtered list of reports based on the search criteria and the resource filter.
 *
 * @param {IReports[]} selectedFilters - The initial list of reports to be filtered.
 * @param {string} searchValue - The search string to filter reports by their names.
 * @param {string[]} resourceFilter - An array of resource names to filter the reports by their creators.
 * @returns {UseSearchResult} An object containing the filtered list of reports and a function to set this list.
 */
export const useReportSearch = (
  selectedFilters: IReports[],
  searchValue: string,
  resourceFilter: string[]
): UseSearchResult => {
  const [filteredList, setFilteredList] = useState<IReports[]>([]);

  useEffect(() => {
    let updatedList = selectedFilters;

    // Apply search filter if searchValue is provided
    if (searchValue) {
      updatedList = _.filter(updatedList, (item) =>
        _.includes(_.toLower(item.name), _.toLower(searchValue))
      );
    }

    // Apply resource filter if resourceFilter array is not empty
    if (!_.isEmpty(resourceFilter)) {
      updatedList = _.filter(updatedList, (item) =>
        _.includes(resourceFilter, item.details[0].creator)
      );
    }

    setFilteredList(updatedList);
  }, [searchValue, selectedFilters, resourceFilter]);

  return { filteredList, setFilteredList };
};
