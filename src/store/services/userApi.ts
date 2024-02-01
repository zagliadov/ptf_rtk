// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Endpoints } from "src/constants/endpoint";

// Define a service using a base URL and expected endpoints
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: Endpoints.API_USER_DATA,
  }),
  endpoints: (builder) => ({
    getUserInfoData: builder.query<any, any>({
      query: () => `select.json`,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetUserInfoDataQuery,
} = userApi;
