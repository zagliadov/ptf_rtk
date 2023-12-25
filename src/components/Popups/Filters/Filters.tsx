import { FC, useCallback, useRef, useState } from "react";
import styles from "./Filters.module.scss";
import classnames from "classnames/bind";
import { PopupHeader } from "../PopupHeader/PopupHeader";
import { ButtonWrapper } from "src/components/ButtonWrapper/ButtonWrapper";
import { Button } from "src/components/Button/Button";
import { useAppDispatch } from "src/store/store";
import {
  setIsFiltersOpen,
  setColumnSelectorOpen,
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
import { setSelectedFilters } from "src/store/filtersSlice";
import { createReport, setIsReportCreated } from "src/store/reportSlice";

const cx: CX = classnames.bind(styles);

export const Filters: FC = () => {
  const { handleSubmit, watch, setValue, reset } =
    useFormContext<DynamicFormData>();
  const [searchValue, setSearchValue] = useState<string>("");
  const [saveFilteredList, setSaveFilteredList] = useState<IIFilters[]>(
    watch(EDataKeys.FILTERED_LIST) || []
  );
  const filtersWrapperRef = useRef<HTMLDivElement>(null);
  const maxHeight: string = useElementHeight(filtersWrapperRef);
  const dispatch = useAppDispatch();

  const handleCloseFilters = useCallback((): void => {
    dispatch(setIsFiltersOpen(false));
    dispatch(setColumnSelectorOpen(true));
  }, [dispatch]);

  const onSubmit = useCallback(
    async (data: DynamicFormData): Promise<void> => {
      console.log(data, "data");
      await dispatch(createReport(data)).then(() => {
        dispatch(setSelectedFilters(data[EDataKeys.FILTERED_LIST]));
        dispatch(setIsFiltersOpen(false));
        reset();
      }).then(() => {
        dispatch(setIsReportCreated(false));
      });
    },
    [dispatch, reset]
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
            <Button
              primary
              title="Create report"
              type="submit"
              style={{ width: "134px" }}
            />
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
