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
      localStorage.setItem("selectedFilters", JSON.stringify(action.payload));
    },
  },

  extraReducers: (builder) => {},
});

export const { setSelectedFilters } = filtersSlice.actions;

export default filtersSlice.reducer;
