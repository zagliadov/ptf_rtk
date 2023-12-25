import { useEffect, useState } from "react";
import * as _ from "lodash";
import { SourceReports } from "./useSideMenuReports";

interface UseSearchResult {
  filteredList: SourceReports[];
  setFilteredList: React.Dispatch<React.SetStateAction<SourceReports[]>>;
}
/**
 * Custom hook for searching and filtering reports.
 *
 * This hook is designed to filter a given array of report sources based on a search value and a set of resource filters. It processes each report within the report sources, applying the search and resource filters, and returns an updated list of report sources with the filtered reports.
 *
 * @param {SourceReports[]} reportsArray - The initial array of report sources to be filtered. Each report source contains an array of reports along with additional information like the source ID.
 * @param {string} searchValue - The search string used to filter reports by their names. This filter checks if the report name includes the search string, ignoring case sensitivity.
 * @param {string[]} resourceFilter - An array of resource names (creators) used to filter the reports. This filter checks if any of the report's details were created by the specified resources.
 * @returns {UseSearchResult} An object containing two properties:
 *   1. filteredList: An array of filtered report sources based on the provided search and resource criteria.
 *   2. setFilteredList: A function to manually set the filtered list of report sources.
 *
 * The hook first maps over the reportsArray, applying the search filter to each report's name. It then applies the resource filter to the details of each report, checking if any detail's creator matches the resourceFilter criteria. Finally, it filters out any report sources that have no remaining reports after the filtering process.
 */
export const useReportSearch = (
  reportsArray: SourceReports[],
  searchValue: string,
  resourceFilter: string[]
): UseSearchResult => {
  // State to store the filtered list of report sources
  const [filteredList, setFilteredList] = useState<SourceReports[]>([]);

  useEffect(() => {
    // Mapping over each report source to apply filters
    let updatedList = reportsArray.map((reportSource) => {
      // Filtering reports within each source based on search and resource criteria
      const filteredReports = _.filter(reportSource.reports, (report) => {
        // Checking if report name matches the search value
        const matchesSearch = searchValue
          ? _.includes(_.toLower(report.name), _.toLower(searchValue))
          : true;
        // Checking if any report detail's creator matches the resource filter
        const matchesResource = !_.isEmpty(resourceFilter)
          ? report.details.some((detail) =>
              resourceFilter.includes(detail.creator)
            )
          : true;
        return matchesSearch && matchesResource;
      });

      return {
        ...reportSource,
        reports: filteredReports,
      };
    });

    // Filtering out report sources with no remaining reports
    updatedList = updatedList.filter(
      (reportSource) => reportSource.reports.length > 0
    );

    // Updating the state with the filtered list
    setFilteredList(updatedList);
  }, [searchValue, reportsArray, resourceFilter]);

  return { filteredList, setFilteredList };
};
