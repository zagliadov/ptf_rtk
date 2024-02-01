// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Endpoints } from "src/constants/endpoint";
import { ReportData } from "src/types";

export type ICreateReport = {
  sourceId: string;
  name: string;
  type: string;
  "Report Creator Email": string | null;
};

const headers = {
  "Content-Type": "application/json",
};

// Define a service using a base URL and expected endpoints
export const customReportApi = createApi({
  reducerPath: "customReportApi",
  baseQuery: fetchBaseQuery({
    baseUrl: Endpoints.API_CUSTOM_REPORT,
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
    createCustomReport: builder.mutation({
      query: (formData: ICreateReport) => ({
        url: `/upsert.json`,
        method: "POST",
        headers,
        body: formData,
      }),
    }),
    updateCustomReport: builder.mutation({
      query: (formData) => ({
        url: `/upsert.json`,
        method: "POST",
        headers,
        body: formData,
      }),
    }),
    deleteCustomReport: builder.mutation({
      query: (reportId: number) => ({
        url: `/delete.json?id=${reportId}`,
        method: "GET",
        headers,
      }),
    }),
    getReport: builder.query<ReportData, number>({
      query: (reportId) => {
        const urlParams = new URLSearchParams();
        urlParams.append("filter", `[id]='${reportId}'`);
        return `List%20All/select.json?${urlParams.toString()}`;
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetGeneralReportsQuery,
  useCreateCustomReportMutation,
  useUpdateCustomReportMutation,
  useDeleteCustomReportMutation,
  useGetReportQuery
} = customReportApi;
