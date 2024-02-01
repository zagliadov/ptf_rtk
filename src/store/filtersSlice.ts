import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IIFilters } from "src/types";
import axios from "axios";
import { Endpoints } from "src/constants/endpoint";

interface IFilterChoice {
  choice: string[];
  filterName: string;
  reportName: string;
}
interface IFiltersState {
  selectedFilters: IIFilters[];
  filterChoice: IFilterChoice | null;
  userInteracted: boolean;
}

const initialState: IFiltersState = {
  selectedFilters: [],
  filterChoice: null,
  userInteracted: false,
};

interface IUpdateFilterChoice {
  reportName: string;
  filterName: string;
  newChoice: string[];
}

export const updateFilterChoice = createAsyncThunk(
  "filters/updateChoiceToNull",
  async (
    { reportName, filterName, newChoice }: IUpdateFilterChoice,
    { rejectWithValue }
  ) => {
    try {
      const findUrl = `${Endpoints.API_REPORT_COLUMN}/List%20All/select.json`;
      const upsertUrl = `${Endpoints.API_REPORT_COLUMN}/upsert.json`;
      const urlParams = new URLSearchParams();
      urlParams.append(
        "filter",
        `[Report Name]='${reportName}' AND [name]='${filterName}'`
      );

      const findResponse = await axios.get(
        `${findUrl}?${urlParams.toString()}`
      );
      const item = findResponse.data;
      if (!item[0]) {
        throw new Error("Not found");
      }
      const updateData = {
        "@row.id": item[0]["@row.id"],
        choice: JSON.stringify(newChoice),
      };
      await axios.post(`${upsertUrl}`, updateData);

      return item[0];
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSelectedFilters(state, action: PayloadAction<IIFilters[]>) {
      state.selectedFilters = action.payload;
      localStorage.setItem("selectedFilters", JSON.stringify(action.payload));
    },
    setFilterChoice(state, action: PayloadAction<any>) {
      state.filterChoice = action.payload;
    },
    setUserInteracted(state, action: PayloadAction<boolean>) {
      state.userInteracted = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(updateFilterChoice.pending, (state) => {})
      .addCase(updateFilterChoice.fulfilled, (state, action) => {})
      .addCase(updateFilterChoice.rejected, (state, action) => {});
  },
});

export const { setSelectedFilters, setFilterChoice, setUserInteracted } = filtersSlice.actions;

export default filtersSlice.reducer;
