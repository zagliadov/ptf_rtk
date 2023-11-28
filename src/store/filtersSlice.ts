import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IIFilters } from "src/types";

interface IFiltersState {
  selectedFilters: IIFilters[];
}

const initialState: IFiltersState = {
  selectedFilters: [],
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSelectedFilters(state, action: PayloadAction<IIFilters[]>) {
      state.selectedFilters = action.payload;
    }
  },

  extraReducers: () => {},
});

export const { setSelectedFilters } = filtersSlice.actions;

export default filtersSlice.reducer;
