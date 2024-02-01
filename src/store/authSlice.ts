import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Endpoints } from "src/constants/endpoint";
import * as _ from "lodash";
import { RootState } from "./store";

interface IFiltersState {
  userEmail: string | null;
  userResources: any;
}

const initialState: IFiltersState = {
  userEmail: null,
  userResources: [],
};

export const fetchAllUserResources = createAsyncThunk(
  "auth/fetchAllUserResources",
  async (_, { rejectWithValue }) => {
    try {
      const urlParams = new URLSearchParams();
      urlParams.append("filter", "[Show in Resource Scheduler]=true");
      urlParams.append("column", "Full Name");
      urlParams.append("column", "Show in Resource Scheduler");
      urlParams.append("column", "Role");
      urlParams.append("column", "E-mail");
      urlParams.append("column", "Holiday Approval First Instance");
      urlParams.append("column", "Province");
      urlParams.append("column", "Photo");

      const response = await axios.get(
        `${Endpoints.API_USER_DATA}select.json?${urlParams.toString()}`
      );
      return response.data.map((item: any) => {
        const teamLeadEmail =
          item["Holiday Approval First Instance"].match(/<(.*)>/)?.[1];
        const imagePath = item["Photo"] ? item["Photo"].split(";")?.[2] : null;
        const logo = imagePath
          ? `https://compass.apexdigital.online/secure/api/v2/90539/User/Photo/attachment/${imagePath}`
          : "";

        return {
          id: item["@row.id"],
          role: item.Role,
          fullName: item["Full Name"],
          email: item["E-mail"],
          teamLeadId:
            response.data.find(
              (resource: any) => resource["E-mail"] === teamLeadEmail
            )?.["@row.id"] || null,
          province: item.Province || "",
          logo,
        };
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserEmail(state, action: PayloadAction<string | null>) {
      state.userEmail = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUserResources.pending, (state) => {
      })
      .addCase(fetchAllUserResources.fulfilled, (state, action) => {
        state.userResources = action.payload;
      })
      .addCase(fetchAllUserResources.rejected, (state, action) => {
      });
  },
});

export const selectUserDataByEmail = (state: RootState) => {
  const { userEmail, userResources } = state.auth;
  if (!userEmail) return undefined;

  return _.find(userResources, { email: userEmail });
};

export const { setUserEmail } = authSlice.actions;

export default authSlice.reducer;
