// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Endpoints } from "src/constants/endpoint";
import { Source } from "src/constants/sources";
import { ColumnData, EDataKeys, SourceType } from "src/types";

// Define a service using a base URL and expected endpoints
export const sourceApi = createApi({
  reducerPath: "sourceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: Endpoints.API_FILTERS_DATA,
  }),
  endpoints: (builder) => ({
    getFiltersDescribeData: builder.query<any, string>({
      query: (dataSource) => `${dataSource}/describe.json`,
    }),
    getFiltersSelectData: builder.query<any, SourceType>({
      query: (source) =>
        `${source[EDataKeys.DATA_SOURCE]}/${source[EDataKeys.API]}/select.json`,
    }),
    getSourceItemsData: builder.query<Record<string, unknown>[], Source>({
      query: (source: Source) =>
        `${source.tableName}/${source.viewName}/select.json`,
    }),
    getSourceInfoData: builder.query<{columns: ColumnData[]}, Source>({
      query: (source: Source) =>
        `${source.tableName}/describe.json`,
    })
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetFiltersDescribeDataQuery, useGetFiltersSelectDataQuery, useGetSourceInfoDataQuery, useGetSourceItemsDataQuery } =
  sourceApi;
