import { useState, useEffect, useCallback, useMemo } from "react";
import _ from "lodash";
import { EDataKeys, IIFilters } from "src/types";
import {
  useGetSourceInfoDataQuery,
  useGetSourceItemsDataQuery,
} from "src/store/services/sourceApi";
import { useGetGeneralReportsQuery } from "src/store/services/reportSettingsApi";
import { RootState, useAppDispatch, useAppSelector } from "src/store/store";
import { setReportFilters } from "src/store/reportSlice";
import { Source, sourceByType } from "src/constants/sources";

/**
 * Custom hook to manage and process report data.
 *
 * @returns {Object} Object containing report data and functions to manage it.
 */
const useReportData = () => {
  const { reportId, reportSourceId, isReportCreated, isReportDelete } =
    useAppSelector((state: RootState) => state.report);
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
          cellRenderer: (params: any) => params.value,
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
          const parsedFilters = JSON.parse(reportDetails.filters);
          console.log(parsedFilters, "parsedFilters");
          return parsedFilters.filter((filter: any) => filter.pinToMainView);
        } catch (error) {
          console.error("Error parsing filters", error);
          return [];
        }
      }
    }
    return [];
  }, [reportData, isLoadingReports, reportId]);

  useEffect(() => {
    if (processedFilters.length > 0) {
      processFilters(processedFilters);
    }
  }, [processFilters, processedFilters]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      refetchReports();
    }, 2000);
    return () => clearTimeout(timerId);
  }, [refetchReports, isReportCreated]);

  useEffect(() => {
    if (isReportCreated || isReportDelete) {
      refetchReports();
      refetchSource();
    }
  }, [isReportCreated, isReportDelete, refetchReports, refetchSource]);

  return {
    reportId,
    reportSourceId,
    finalFilterArray,
    columns,
    rows: rowData || [],
  };
};

export default useReportData;

// import { useState, useEffect, useCallback, useMemo } from "react";
// import * as _ from "lodash";
// import { EDataKeys, IIFilters } from "src/types";
// import {
//   useGetSourceInfoDataQuery,
//   useGetSourceItemsDataQuery,
// } from "src/store/services/sourceApi";
// import { useGetGeneralReportsQuery } from "src/store/services/reportSettingsApi";
// import { RootState, useAppDispatch, useAppSelector } from "src/store/store";
// import { setReportFilters } from "src/store/reportSlice";
// import { Source, sourceByType } from "src/constants/sources";

// /**
//  * Custom hook to manage and process report data.
//  *
//  * @returns {Object} Object containing report data and functions to manage it.
//  */
// const useReportData = () => {
//   const { reportId, reportSourceId, isReportCreated, isReportDelete } =
//     useAppSelector((state: RootState) => state.report);
//   const [finalFilterArray, setFinalFilterArray] = useState<IIFilters[]>([]);
//   const dispatch = useAppDispatch();

//   const {
//     data,
//     isLoading: isLoadingReports,
//     refetch,
//   } = useGetGeneralReportsQuery(undefined);

//   const source: Source = sourceByType[reportSourceId];

//   const { data: rowData, refetch: refetchSource } = useGetSourceItemsDataQuery(
//     source,
//     {
//       skip: !source,
//     }
//   );

//   const { data: describeData, isLoading: isLoadingDescribeData } =
//     useGetSourceInfoDataQuery(source, { skip: !source });

//   const columns = useMemo(() => {
//     const reportData = _.find(data, { "@row.id": reportId });

//     const reportColumnIds: string[] = JSON.parse(
//       _.get(reportData, EDataKeys.COLUMN_IDS, "") || "[]"
//     );

//     return describeData?.columns
//       .filter((column) => reportColumnIds.includes(column.id.toString()))
//       .map((column) => ({
//         ...column,
//         field: column.name,
//         cellRenderer: (params: any) => params.value,
//       }));
//   }, [data, describeData, reportId]);

//   /**
//    * Processes filters by extending them with additional data from describeData.
//    *
//    * @param {IIFilters[]} filters - Array of filters to be processed.
//    */
//   const processFilters = useCallback(
//     (filters: IIFilters[]) => {
//       console.log(!!isLoadingDescribeData && filters && describeData, "describeColumns Hello")
//       if (!isLoadingDescribeData && filters && describeData) {
//         const describeColumns = _.get(describeData, "columns", []);
//         const extendedFilters = _.map(filters, (filterItem) => {
//           const generalArrayItem = _.find(describeColumns, {
//             name: filterItem.name,
//           });
//           return _.assign({}, filterItem, generalArrayItem);
//         });
//         setFinalFilterArray(extendedFilters);
//         dispatch(setReportFilters(extendedFilters));
//       }
//     },
//     [isLoadingDescribeData, describeData, dispatch]
//   );

//   const processedFilters = useMemo(() => {
//     if (!isLoadingReports && data && reportId) {
//       const reportData = _.find(data, { "@row.id": reportId });
//       try {
//         console.log(reportData, "reportData processedFilters")
//         if (reportData) {
//           const parsedFilters = JSON.parse(reportData?.filters) || "[]";
//           console.log(parsedFilters, "parsedFilters JSON.parse");
//           return parsedFilters;
//         }
//       } catch (error) {
//         console.error("Error parsing filters", error);
//       }
//     }
//     return [];
//   }, [data, isLoadingReports, reportId]);

//   useEffect(() => {
//     console.log(processedFilters, "describeColumns")
//     if (processedFilters.length > 0) {
//       processFilters(processedFilters);
//     }
//   }, [processFilters, processedFilters]);

//   useEffect(() => {
//     if (isReportCreated) {
//       refetch();
//       refetchSource();
//       console.log(isReportCreated, "refetch is report created");
//     }
//     console.log(isReportCreated, "isReportCreated");
//   }, [isReportCreated, refetch, refetchSource]);

//   return {
//     reportId,
//     reportSourceId,
//     finalFilterArray,
//     columns: columns || [],
//     rows: rowData || [],
//   };
// };

// export default useReportData;
