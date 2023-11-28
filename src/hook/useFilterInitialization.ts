import { useState, useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import {
  useGetFiltersDescribeDataQuery,
  useGetFiltersSelectDataQuery,
} from "src/store/services/filtersApi";
import { ColumnData, EDataKeys, IIFilters, SourceType } from "src/types";
import * as _ from "lodash";

/**
 * Custom hook to initialize filter data for the ColumnList component.
 * This hook uses Redux Toolkit queries to fetch 'describe' and 'select' data based on the provided data source.
 * It then processes this fetched data to create a set of filters for use in the ColumnList component.
 *
 * @returns {object} An object containing the filter data, a method to set filter data, and a loading state.
 *
 * @property {IIFilters[]} filters - The current state of filters, containing filter configurations and their values.
 * @property {function} setFilters - Method to update the state of filters.
 * @property {boolean} isLoading - Indicates if the filter data is currently being fetched.
 *
 * This hook utilizes useMemo to optimize the processing of fetched data, ensuring efficient re-calculation only when necessary.
 * It also ensures that the filter data is initialized only once and not overwritten during subsequent renders.
 * 
 * @example
 * const { filters, setFilters, isLoading } = useFilterInitialization();
 *
 * useEffect(() => {
 *   if (!isLoading) {
 *     // Perform actions with filters
 *   }
 * }, [filters, isLoading]);
 */

const useFilterInitialization = () => {
  // useFormContext hook from react-hook-form is used for form state management.
  const { watch, setValue } = useFormContext();

  // State to store filter data.
  const [filters, setFilters] = useState<IIFilters[]>([]);

  // Watching the data source key from the form state.
  const dataSource = watch(EDataKeys.DATA_SOURCE);

  // Custom query hook from Redux Toolkit to fetch filter data based on data source.
  const source: SourceType = {
    [EDataKeys.DATA_SOURCE]: dataSource,
    [EDataKeys.API]: dataSource === EDataKeys.DATA_SOURCE_PROJECT ? EDataKeys.API_DATA_WAREHOUSE : EDataKeys.API_VIEW,
  };

  const {
    data: describeData,
    isLoading: isLoadingDescribeData,
    isFetching: isFetchingDescribeData,
  } = useGetFiltersDescribeDataQuery(dataSource);

  const {
    data: selectData,
    isFetching: isFetchingSelectData,
    isLoading: isLoadingSelectData,
  } = useGetFiltersSelectDataQuery(source);

  const processedData: ColumnData[] = useMemo((): ColumnData[] => {
    if (!selectData || !describeData) return [];

    // Get keys from the first object in selectData
    const selectKeys: string[] = _.keys(_.first(selectData));
    // Retrieve 'columns' array from describeData, or an empty array if not present
    const describeColumns: ColumnData[] = _.get(describeData, "columns", []);

    // Filter describeColumns to include only those items whose names are in selectKeys
    return _.filter(describeColumns, (column) =>
      _.includes(selectKeys, column.name)
    );

  }, [selectData, describeData]);

  useEffect(() => {
    if (
      !isFetchingSelectData &&
      !isFetchingDescribeData &&
      processedData.length > 0
    ) {
      const hasData: IIFilters = watch(EDataKeys.FILTERS);
      const initialFilters: IIFilters[] = hasData
        ? watch(EDataKeys.FILTERS)
        : _.map(processedData, (item) => ({
            checked1: false,
            checked2: false,
            disabled: false,
            pinToMainView: false,
            ...item,
          }));

      setFilters(initialFilters);
      setValue(EDataKeys.FILTERS, initialFilters);
    }
  }, [
    processedData,
    isFetchingSelectData,
    isFetchingDescribeData,
    setValue,
    watch,
  ]);

  const memoizedFilters = useMemo(() => {
    return filters;
  }, [filters]);

  return {
    filters: memoizedFilters,
    setFilters,
    isLoading: isLoadingDescribeData || isLoadingSelectData,
  };
};

export default useFilterInitialization;
