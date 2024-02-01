import { FC, useCallback, useRef, useState } from "react";
import styles from "./EditFilters.module.scss";
import classnames from "classnames/bind";
import { PopupHeader } from "../PopupHeader/PopupHeader";
import { ButtonWrapper } from "src/components/ButtonWrapper/ButtonWrapper";
import { Button } from "src/components/Button/Button";
import { useAppDispatch } from "src/store/store";
import {
  setIsEditFiltersOpen,
  setEditColumnSelectorOpen,
  setIsSaveFiltersChangesOpen,
} from "src/store/managerSlice";
import Search from "src/components/Search";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import "./simplebar.scss";
import { useElementHeight } from "src/hook/useElementHeight";
import { useFormContext } from "react-hook-form";
import { FilteredColumns } from "../Filters/FilteredColumns/FilteredColumns";
import { DynamicFormData, EDataKeys, IIFilters } from "src/types";
import * as _ from "lodash";
import { setSelectedFilters } from "src/store/filtersSlice";
import { useEditColumnSelector } from "src/hook/useEditColumnSelector";

const cx: CX = classnames.bind(styles);

export const EditFilters: FC = () => {
  const { handleSubmit, watch, setValue, reset } =
    useFormContext<DynamicFormData>();
  const [searchValue, setSearchValue] = useState<string>("");
  const { reportFilters } = useEditColumnSelector();
  const [saveFilteredList, setSaveFilteredList] = useState<IIFilters[]>(
    reportFilters || []
  );
  const filtersWrapperRef = useRef<HTMLDivElement>(null);
  const maxHeight: string = useElementHeight(filtersWrapperRef);
  const dispatch = useAppDispatch();
  const handleBack = useCallback(() => {
    dispatch(setIsEditFiltersOpen(false));
    dispatch(setEditColumnSelectorOpen(true));
  }, [dispatch]);

  const handleCloseFilters = useCallback((): void => {
    dispatch(setIsEditFiltersOpen(false));
    reset();
  }, [dispatch, reset]);

  const onSubmit = useCallback(
    async (data: DynamicFormData): Promise<void> => {
      dispatch(setSelectedFilters(data[EDataKeys.FILTERED_LIST]));
      dispatch(setIsSaveFiltersChangesOpen(true));
    },
    [dispatch]
  );

  /**
   * We get the initial list of filters, resetting the 'pinToMainView' settings for selected filters.
   */
  const handleResetColumns = useCallback((): void => {
    const filters: IIFilters[] = watch(EDataKeys.FILTERS);
    const updatedFilters = _.chain(filters)
      .filter(EDataKeys.SELECTED_TABLE_CELL) // Filter out the filters that are marked.
      .map((item: IIFilters) => ({ ...item, pinToMainView: false, choice: "" })) // Reset 'pinToMainView'.
      .value();
    // Update the list of saved filters.
    setSaveFilteredList(updatedFilters);
    updatedFilters.forEach((filter) => {
      setValue(filter.name, ""); // Resetting the value of each field
    });
  }, [setValue, watch]);

  const handleSearchChange = useCallback((newValue: string): void => {
    setSearchValue(newValue);
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={cx("edit-filters")}>
        <div className={cx("edit-filters-header-wrapper")}>
          <PopupHeader
            title={"Edit Filters"}
            description={
              "Apply filters, set the order and select favorites to build report"
            }
            onClose={handleCloseFilters}
          />
          <div className={cx("search-wrapper")}>
            <Search
              onChange={handleSearchChange}
              value={searchValue}
              placeholder={"Search by Filter"}
              width={"100%"}
            />
          </div>
        </div>

        <div ref={filtersWrapperRef} className={cx("edit-filters-wrapper")}>
          <SimpleBar
            style={{ maxHeight }}
            className="my-custom-scrollbar-filters"
          >
            <FilteredColumns
              searchValue={searchValue}
              saveFilteredList={saveFilteredList}
              setSaveFilteredList={setSaveFilteredList}
              isEdit={true}
            />
          </SimpleBar>
        </div>
        <div className={cx("edit-filters-footer")}>
          <ButtonWrapper shift={"right"}>
            <Button
              primary
              title="Save report"
              type="submit"
              style={{ width: "134px" }}
            />
            <Button
              title="Reset all"
              onClick={handleResetColumns}
              style={{ width: "86px", marginLeft: "16px" }}
            />
            <Button
              title="Back"
              onClick={handleBack}
              style={{ width: "86px", marginLeft: "16px" }}
            />
          </ButtonWrapper>
        </div>
      </div>
    </form>
  );
};