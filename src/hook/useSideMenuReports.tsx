import { useState, useEffect, useMemo } from "react";
import * as _ from "lodash";
import { useGetGeneralReportsQuery } from "src/store/services/customReportApi";
import { EDataKeys } from "src/types";
import { useAppDispatch, useAppSelector, RootState } from "src/store/store";
import {
  setReportId,
  setReportName,
  setReportSourceId,
  setReportType,
} from "src/store/reportSlice";
import { format, parseISO } from "date-fns";
import { fetchAllUserResources } from "src/store/authSlice";

export interface ReportRaw {
  "@row.id": number;
  sourceId: string | null;
  name: string;
  type: EDataKeys.INTERNAL | EDataKeys.EXTERNAL;
  "Date Created": string;
  "Date Modified": string | null;
  "Created By": string;
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
  dateCreated: string;
  department: string;
  dateUpdated: string | null;
  creator: string;
  purpose: string | null,
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
const useSideMenuReports = (): ExtendedSourceReports[] | any => {
  const [reportsArray, setReportsArray] = useState<ExtendedSourceReports[]>([]);
  const { data, isLoading, refetch } = useGetGeneralReportsQuery(undefined);
  const dispatch = useAppDispatch();
  const { isReportCreated, isReportDelete } = useAppSelector(
    (state: RootState) => state.report
  );
  const { userResources } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchAllUserResources());
  }, [dispatch]);

  const processedData = useMemo(() => {
    if (!isLoading && data && userResources) {
      return _.chain(data as ReportRaw[])
        .groupBy("sourceId")
        .mapValues((reports) =>
          reports.map(report => {
            const userResource = userResources.find((user: any) => user.email === report["Report Creator Email"]);
            const details = {
              reportName: report.name,
              creator: userResource ? userResource?.fullName : report["Created By"],
              department: userResource ? userResource.role : "Unknown",
              dateCreated: report["Date Created"]
                ? format(parseISO(report["Date Created"]), "dd.MM.yyyy")
                : "",
              dateUpdated: report["Date Modified"]
                ? format(parseISO(report["Date Modified"]), "dd.MM.yyyy")
                : null,
              purpose: null
            };

            return {
              "@row.id": report["@row.id"],
              name: report.name,
              type: report.type,
              details: [details],
            };
          })
        )
        .toPairs()
        .filter(([sourceId]) => sourceId !== null && sourceId !== "null")
        .map(([sourceId, reports]) => ({ sourceId, reports }))
        .value();
    }
    return [];
  }, [data, isLoading, userResources]);

  useEffect(() => {
    setReportsArray(processedData);
  }, [processedData]);

  useEffect(() => {
    if (isReportDelete || isReportCreated) {
      refetch();
    }
  }, [isReportDelete, isReportCreated, refetch]);

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

  return { reportsArray, refetch };
};

export default useSideMenuReports;
