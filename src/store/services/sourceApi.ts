// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Endpoints } from "src/constants/endpoint";
import { Source } from "src/constants/sources";
import { ColumnData, EDataKeys, SourceType } from "src/types";
import { catchError, EMPTY, expand, from, lastValueFrom, map, reduce } from "rxjs";
import axios, { AxiosResponse } from "axios";

const MAX_TOTAL_RECORDS = 500;

type SourceItem = Record<string, unknown>;

type SourceItemsDataChunk = {
  data: SourceItem[],
  totalCount: number,
}

async function getSourceItemsDataChunk(source: Source, page: number) {
  const skip = MAX_TOTAL_RECORDS * (page - 1);

  const url = `${Endpoints.API_FILTERS_DATA}${source.tableName}/${source.viewName}/select.json?skip=${skip}`;

  return lastValueFrom(
    from(axios.get(url)).pipe(
      map((response: AxiosResponse<SourceItem[]>) => ({
        data: response.data,
        totalCount: response.data.length,
      })),
    ).pipe(
      catchError(() => {
        throw new Error("Error in getSourceItemsData");
      }),
    ),
  );
}

async function getSourceItemsDataFn(source: Source) {
  let page = 1;

  const data = await lastValueFrom(
    from(getSourceItemsDataChunk(source, page++))
      .pipe(
        expand((response: SourceItemsDataChunk) => {
          return response.totalCount === MAX_TOTAL_RECORDS
            ? getSourceItemsDataChunk(source, page++)
            : EMPTY;
        }),
        reduce((acc: SourceItem[], current: SourceItemsDataChunk) => {
            return acc.concat(current.data);
          },
          [],
        ),
      ),
  );

  return {
    data,
  };
}

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
    getSourceItemsData: builder.query<SourceItem[], Source>({
      queryFn: getSourceItemsDataFn,
    }),
    getSourceInfoData: builder.query<{ columns: ColumnData[] }, Source>({
      query: (source: Source) => `${source.tableName}/describe.json`,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetFiltersDescribeDataQuery,
  useGetFiltersSelectDataQuery,
  useGetSourceInfoDataQuery,
  useGetSourceItemsDataQuery,
} = sourceApi;
