import { useState, useEffect, useMemo } from "react";
import * as _ from "lodash";
import { useGetGeneralReportsQuery } from "src/store/services/reportSettingsApi";
import { EDataKeys } from "src/types";
import { useAppDispatch, useAppSelector, RootState } from "src/store/store";
import {
  setBasicReportData,
  setReportId,
  setReportName,
  setReportSourceId,
  setReportType,
} from "src/store/reportSlice";

export interface ReportRaw {
  "@row.id": number;
  sourceId: string | null;
  name: string;
  type: EDataKeys.INTERNAL | EDataKeys.EXTERNAL;
}

export interface Report {
  "@row.id": number;
  name: string;
  type: EDataKeys.INTERNAL | EDataKeys.EXTERNAL;
  details: ReportDetail[];
}

export interface SourceReports {
  sourceId: string;
  reports: Report[];
}
export interface ReportDetail {
  reportName: string;
  content: string;
  creator: string;
  department: string;
  role: string;
  dateCreated: string;
  dateUpdated: string;
  purpose: string;
}

interface ExtendedReport extends Report {
  details: ReportDetail[];
}
interface ExtendedSourceReports {
  sourceId: string;
  reports: ExtendedReport[];
}
/**
 * Custom hook to fetch and process report data for use in the SideMenu component.
 *
 * This hook uses the `useGetGeneralReportsQuery` from Redux Toolkit to fetch report data.
 * Once the data is fetched, it processes the data to match the structure required by the SideMenu.
 * The processed data includes grouping reports by their sourceId and adding additional details to each report.
 *
 * @returns {ExtendedSourceReports[]} The processed array of reports, each with a sourceId and an array of reports.
 *
 * @example
 * const reportsArray = useProcessedReports();
 * Use reportsArray in your component
 */
const useSideMenuReports = (): ExtendedSourceReports[] => {
  const [reportsArray, setReportsArray] = useState<ExtendedSourceReports[]>([]);
  const { data, isLoading, refetch } = useGetGeneralReportsQuery(undefined);
  const dispatch = useAppDispatch();
  const { isReportCreated, isReportDelete, reportSourceId } = useAppSelector(
    (state: RootState) => state.report
  );
  const processedData = useMemo(() => {
    if (!isLoading && data) {
      return _.chain(data as ReportRaw[])
        .groupBy("sourceId")
        .mapValues((reports) =>
          reports.map(({ "@row.id": rowId, name, type }) => ({
            "@row.id": rowId,
            name,
            type,
            details: [
              {
                reportName: "Site Report A",
                content: "Site Report Content A",
                creator: "Jack Young",
                department: "Design",
                role: "Designer",
                dateCreated: "30.10.2023",
                dateUpdated: "31.10.2023",
                purpose: "Site Analysis",
              },
            ],
          }))
        )
        .toPairs()
        .filter(([sourceId]) => sourceId !== null && sourceId !== "null")
        .map(([sourceId, reports]) => ({ sourceId, reports }))
        .value();
    }
    return [];
  }, [data, isLoading]);

  useEffect(() => {
    setReportsArray(processedData);
  }, [processedData]);

  useEffect(() => {
    if (isReportCreated || isReportDelete) {
      refetch();
    }
  }, [isReportCreated, isReportDelete, refetch]);

  useEffect(() => {
    if (reportsArray.length > 0 && isReportDelete) {
      const randomSourceIndex = Math.floor(Math.random() * reportsArray.length);
      const randomSource = reportsArray[randomSourceIndex];

      if (randomSource.reports.length > 0) {
        const randomReportIndex = Math.floor(
          Math.random() * randomSource.reports.length
        );
        const randomReport = randomSource.reports[randomReportIndex];

        const { name, "@row.id": rowId, type } = randomReport;
        dispatch(setReportId(rowId));
        dispatch(setReportName(name));
        dispatch(setReportSourceId(randomSource.sourceId));
        dispatch(setReportType(type));
      }
    }
  }, [dispatch, isReportDelete, reportsArray]);

  return reportsArray;
};

export default useSideMenuReports;
