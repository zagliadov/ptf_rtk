// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Endpoints } from "src/constants/endpoint";

const headers = {
  "Content-Type": "application/json",
};
// Define a service using a base URL and expected endpoints
export const reportColumnApi = createApi({
  reducerPath: "reportColumnApi",
  baseQuery: fetchBaseQuery({
    baseUrl: Endpoints.API_REPORT_COLUMN,
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getReportColumn: builder.query({
      query: () => `List%20All/select.json`,
    }),
    createReportColumn: builder.mutation({
      query: (formData) => ({
        url: `/upsert.json`,
        method: "POST",
        headers,
        body: formData,
      }),
    }),
    updateReportColumn: builder.mutation({
      query: (formData) => ({
        url: `/update.json`,
        method: "POST",
        headers,
        body: formData,
      }),
    }),
    deleteReportColumn: builder.mutation({
      query: (columnId: number) => ({
        url: `/delete.json?id=${columnId}`,
        method: "GET",
        headers,
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetReportColumnQuery,
  useCreateReportColumnMutation,
  useUpdateReportColumnMutation,
  useDeleteReportColumnMutation
} = reportColumnApi;
