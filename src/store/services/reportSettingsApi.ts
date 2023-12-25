// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Endpoints } from "src/constants/endpoint";
import { ReportData } from "src/types";

export type ICreateReport = {
  sourceId: string;
  name: string;
  type: string;
};

const headers = {
  "Content-Type": "application/json",
};

// Define a service using a base URL and expected endpoints
export const reportSettingsApi = createApi({
  reducerPath: "reportSettingsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: Endpoints.API_REPORT_SETTINGS,
    prepareHeaders: (headers, { getState }) => {
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getGeneralReports: builder.query<ReportData[], string | undefined>({
      query: (id) => {
        const searchParams = new URLSearchParams();
        if(id) {
          searchParams.append('filter', `[id]=${id}`)
        }
        return `List%20All/select.json`;
      },
    }),
    createReportSettings: builder.mutation({
      query: (formData: ICreateReport) => ({
        url: `/upsert.json`,
        method: "POST",
        headers,
        body: formData,
      }),
    }),
    updateReportSettings: builder.mutation({
      query: (formData) => ({
        url: `/update.json`,
        method: "POST",
        headers,
        body: formData,
      }),
    }),
    deleteReportSettings: builder.mutation({
      query: (reportId: number) => ({
        url: `/delete.json?id=${reportId}`,
        method: "GET",
        headers,
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetGeneralReportsQuery,
  useCreateReportSettingsMutation,
  useUpdateReportSettingsMutation,
  useDeleteReportSettingsMutation,
} = reportSettingsApi;
