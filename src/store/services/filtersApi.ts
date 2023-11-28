// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { EDataKeys, SourceType } from 'src/types';

// Define a service using a base URL and expected endpoints
export const filtersApi = createApi({
  reducerPath: 'filtersApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://compass.apexdigital.online/secure/api/v2/90539/21010A68F2704355A624B6D0CE776A2D/' }),
  endpoints: (builder) => ({
    getFiltersDescribeData: builder.query<any, string>({
      query: (dataSource) => `${dataSource}/describe.json`,
    }),
    getFiltersSelectData: builder.query<any, SourceType>({
      query: (source) => `${source[EDataKeys.DATA_SOURCE]}/${source[EDataKeys.API]}/select.json`,
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetFiltersDescribeDataQuery, useGetFiltersSelectDataQuery } = filtersApi;