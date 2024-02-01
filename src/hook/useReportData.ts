import { useState, useEffect, useCallback, useMemo } from "react";
import _ from "lodash";
import { EDataKeys, IIFilters } from "src/types";
import {
  useGetSourceInfoDataQuery,
  useGetSourceItemsDataQuery,
} from "src/store/services/sourceApi";
import { useGetGeneralReportsQuery } from "src/store/services/customReportApi";
import { RootState, useAppDispatch, useAppSelector } from "src/store/store";
import { setReportFilters } from "src/store/reportSlice";
import { Source, sourceByType } from "src/constants/sources";
import { parseISO, format } from "date-fns";
import fetchCustomData from "./ItemsData";



/**
 * Custom hook to manage and process report data.
 *
 * @returns {Object} Object containing report data and functions to manage it.
 */
const useReportData = () => {
  const { reportId, reportSourceId } = useAppSelector(
    (state: RootState) => state.report
  );
  const [finalFilterArray, setFinalFilterArray] = useState<IIFilters[]>([]);
  const dispatch = useAppDispatch();
  const {
    data: reportData,
    isLoading: isLoadingReports,
    refetch: refetchReports,
  } = useGetGeneralReportsQuery(undefined);
  const source: Source = sourceByType[reportSourceId];
  const { data: rowData, refetch: refetchSource } = useGetSourceItemsDataQuery(
    source,
    { skip: !source }
  );

  const { data: describeData, isLoading: isLoadingDescribeData } =
    useGetSourceInfoDataQuery(source, { skip: !source });
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "dd MMM yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const isISO8601Date = (value: string) => {
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?([+-]\d{2}:\d{2}|Z)$/;
    return regex.test(value);
  };
  

  const columns = useMemo(() => {
    if (!isLoadingDescribeData && describeData && reportData) {
      const reportDetails = _.find(reportData, { "@row.id": reportId });
      const reportColumnIds = JSON.parse(
        reportDetails?.[EDataKeys.COLUMN_IDS] || "[]"
      );
      return describeData.columns
        .filter((column) => reportColumnIds.includes(column.id.toString()))
        .map((column) => ({
          ...column,
          field: column.name,
          cellRenderer: (params: any) => {
            if (isISO8601Date(params.value)) {
              return formatDate(params.value);
            }
            return params.value;
          },
        }));
    }
    return [];
  }, [reportData, describeData, reportId, isLoadingDescribeData]);

  const processFilters = useCallback(
    (filters: any) => {
      if (!isLoadingDescribeData && filters && describeData) {
        const describeColumns = describeData.columns;
        const extendedFilters = filters.map((filterItem: any) => ({
          ...filterItem,
          ...describeColumns.find((column) => column.name === filterItem.name),
        }));
        setFinalFilterArray(extendedFilters);
        dispatch(setReportFilters(extendedFilters));
      }
    },
    [isLoadingDescribeData, describeData, dispatch]
  );

  const processedFilters = useMemo(() => {
    if (!isLoadingReports && reportData && reportId) {
      const reportDetails = _.find(reportData, { "@row.id": reportId });
      if (reportDetails?.filters) {
        try {
          // ========================> The problem lies in how nested arrays and objects are encoded.
          const reportFilters = reportDetails?.filters;
          try {
            const parsedFilters = JSON?.parse(reportFilters);
            return parsedFilters.filter(
              (filter: any) => filter.selectedTableFilter
            );
          } catch (error) {
            console.log(error, "error");
          }
        } catch (error) {
          console.error("Error parsing filters", error);
          setFinalFilterArray([]);
        }
      }
      setFinalFilterArray([]);
    }
    return [];
  }, [reportData, isLoadingReports, reportId]);

  useEffect(() => {
    if (processedFilters.length > 0) {
      processFilters(processedFilters);
    }
  }, [processFilters, processedFilters]);

  const finalColumns = useMemo(() => {
    if (!isLoadingReports && reportData && reportId) {
      const reportDetails = _.find(reportData, { "@row.id": reportId });
      if (reportDetails?.filters) {
        try {
          const parsedFilters = JSON.parse(reportDetails.filters);
          const cells = _.filter(
            parsedFilters,
            (item) => item.selectedTableCell
          );

          // We filter the columns, checking if their name is contained in the cells array.
          return columns.filter((column) =>
            cells.some((cell) => cell.name === column.name)
          );
        } catch (error) {
          console.error("Error parsing filters", error);
        }
      }
    }
    return [];
  }, [columns, isLoadingReports, reportData, reportId]);

  return {
    reportId,
    reportSourceId,
    finalFilterArray,
    columns: finalColumns,
    rows: rowData || [],
    refetchReports,
    refetchSource,
  };
};

export default useReportData;
