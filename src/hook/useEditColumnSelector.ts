import { useState, useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import {
  useGetFiltersDescribeDataQuery,
  useGetFiltersSelectDataQuery,
} from "src/store/services/sourceApi";
import { useAppSelector, RootState } from "src/store/store";
import { ColumnData, EDataKeys, IIFilters, SourceType } from "src/types";
import * as _ from "lodash";

export const useEditColumnSelector = () => {
  // useFormContext hook from react-hook-form is used for form state management.
  const { watch, setValue } = useFormContext();
  const { reportFilters, reportSourceId } = useAppSelector(
    (state: RootState) => state.report
  );
  // State to store filter data.
  const [filters, setFilters] = useState<IIFilters[]>([]);
  // Watching the data source key from the form state.
  const dataSource = watch(EDataKeys.DATA_SOURCE) || reportSourceId;

  // Custom query hook from Redux Toolkit to fetch filter data based on data source.
  const source: SourceType = {
    [EDataKeys.DATA_SOURCE]: dataSource,
    [EDataKeys.API]:
      dataSource === EDataKeys.DATA_SOURCE_PROJECT
        ? EDataKeys.API_DATA_WAREHOUSE
        : EDataKeys.API_VIEW,
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

  const hasData =
    watch(EDataKeys.FILTERS) && watch(EDataKeys.FILTERS).length > 0;
  const initialFilters: IIFilters[] = useMemo(() => {
    if (
      !isFetchingSelectData &&
      !isFetchingDescribeData &&
      processedData.length > 0
    ) {
      return hasData
        ? watch(EDataKeys.FILTERS)
        : _.map(processedData, (item) => ({
            selectedTableCell: false,
            selectedTableFilter: false,
            disabled: item.type === "Multiline",
            pinToMainView: false,
            ...item,
          }));
    }
    return [];
  }, [
    processedData,
    isFetchingSelectData,
    isFetchingDescribeData,
    watch,
    hasData,
  ]);

  const updatedInitialFilters = useMemo(() => {
    // We update only if there is no data (hasData === false)
    if (!hasData) {
      return initialFilters.map((filter) => {
        const reportFilter = _.find(reportFilters, { id: filter.id });
        return reportFilter
          ? _.assign({}, filter, {
              selectedTableCell: reportFilter.selectedTableCell,
              selectedTableFilter: reportFilter.selectedTableFilter,
              pinToMainView: reportFilter.pinToMainView,
              choice: reportFilter.choice,
              position: reportFilter.position ? reportFilter.position : 0,
            })
          : filter;
      });
    }
    // If hasData === true, return initialFilters unchanged
    return initialFilters;
  }, [initialFilters, reportFilters, hasData]);

  useEffect(() => {
    setFilters(updatedInitialFilters);
    setValue(EDataKeys.FILTERS, updatedInitialFilters);
  }, [updatedInitialFilters, setFilters, setValue]);

  return {
    filters: filters,
    setFilters,
    isLoading: isLoadingDescribeData || isLoadingSelectData,
    reportFilters,
  };
};
