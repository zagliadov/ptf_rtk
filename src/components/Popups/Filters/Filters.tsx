import { FC, useCallback, useRef, useState } from "react";
import styles from "./Filters.module.scss";
import classnames from "classnames/bind";
import { PopupHeader } from "../PopupHeader/PopupHeader";
import { ButtonWrapper } from "src/components/ButtonWrapper/ButtonWrapper";
import { Button } from "src/components/Button/Button";
import { useAppDispatch, useAppSelector, RootState } from "src/store/store";
import {
  setIsFiltersOpen,
  setColumnSelectorOpen,
  setIsSaveNewReportOpen,
  setIsReportEditOpen,
} from "src/store/managerSlice";
import Search from "src/components/Search";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import "./simplebar.scss";
import { useElementHeight } from "src/hook/useElementHeight";
import { useFormContext } from "react-hook-form";
import { FilteredColumns } from "./FilteredColumns/FilteredColumns";
import { DynamicFormData, EDataKeys, IIFilters } from "src/types";
import * as _ from "lodash";

const cx: CX = classnames.bind(styles);

export const Filters: FC = () => {
  const { handleSubmit, watch, setValue } = useFormContext<DynamicFormData>();
  const [searchValue, setSearchValue] = useState<string>("");
  const { reportIsEdit } = useAppSelector((state: RootState) => state.manager);
  const storedSelectedFiltersRaw = localStorage.getItem("selectedFilters");
  const storedSelectedFilters: IIFilters[] = storedSelectedFiltersRaw
    ? JSON.parse(storedSelectedFiltersRaw)
    : [];
  const [saveFilteredList, setSaveFilteredList] = useState<IIFilters[]>(
    reportIsEdit ? storedSelectedFilters : watch(EDataKeys.FILTERED_LIST) || []
  );
  const filtersWrapperRef = useRef<HTMLDivElement>(null);
  const maxHeight: string = useElementHeight(filtersWrapperRef);
  const dispatch = useAppDispatch();

  const handleCloseFilters = useCallback((): void => {
    dispatch(setIsFiltersOpen(false));
    dispatch(setColumnSelectorOpen(true));
    dispatch(setIsSaveNewReportOpen(false));
  }, [dispatch]);

  const onSubmit = useCallback(
    (data: DynamicFormData): void => {
      if (reportIsEdit) {
        dispatch(setIsReportEditOpen(true));
      } else {
        console.log("Form Data:", data);
        dispatch(setIsSaveNewReportOpen(true));
      }
    },
    [dispatch, reportIsEdit]
  );

  /**
   * We get the initial list of filters, resetting the 'pinToMainView' settings for selected filters.
   */
  const handleResetColumns = useCallback((): void => {
    const filters: IIFilters[] = watch(EDataKeys.FILTERS);
    const updatedFilters = _.chain(filters)
      .filter(EDataKeys.CHECKED1) // Filter out the filters that are marked.
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
      <div className={cx("filters")}>
        <div className={cx("filters-header-wrapper")}>
          <PopupHeader
            title={"Filters"}
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

        <div ref={filtersWrapperRef} className={cx("filters-wrapper")}>
          <SimpleBar
            style={{ maxHeight }}
            className="my-custom-scrollbar-filters"
          >
            <FilteredColumns
              searchValue={searchValue}
              saveFilteredList={saveFilteredList}
              setSaveFilteredList={setSaveFilteredList}
            />
          </SimpleBar>
        </div>
        <div className={cx("filters-footer")}>
          <ButtonWrapper shift={"right"}>
            {reportIsEdit ? (
              <Button
                primary
                title="Edit report"
                type="submit"
                style={{ width: "134px" }}
              />
            ) : (
              <Button
                primary
                title="Create report"
                type="submit"
                style={{ width: "134px" }}
              />
            )}
            <Button
              title="Reset all"
              onClick={handleResetColumns}
              style={{ width: "86px", marginLeft: "16px" }}
            />
          </ButtonWrapper>
        </div>
      </div>
    </form>
  );
};
