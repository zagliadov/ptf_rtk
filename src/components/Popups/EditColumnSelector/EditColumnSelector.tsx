import { FC, useCallback, useState, lazy, Suspense } from "react";
import classnames from "classnames/bind";
import { ButtonWrapper } from "src/components/ButtonWrapper/ButtonWrapper";
import { Button } from "src/components/Button/Button";
import { PopupHeader } from "../PopupHeader/PopupHeader";
import { RootState, useAppDispatch, useAppSelector } from "src/store/store";
import {
  setEditColumnSelectorOpen,
  setIsUnsavedChanges,
  setReportEditOpen,
} from "src/store/managerSlice";
import Search from "src/components/Search";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import styles from "./EditColumnSelector.module.scss";
import "./simplebar.scss";
import { useFormContext } from "react-hook-form";
import { EDataKeys, IIFilters, RData } from "src/types";
import { DotSpinner } from "src/components/DotSpinner/DotSpinner";
import { useHandleCheckboxAll } from "src/hook/useHandleCheckboxAll";
import { ColumnListHeader } from "../ColumnSelector/ColumnListHeader/ColumnListHeader";
import { useEditColumnSelector } from "src/hook/useEditColumnSelector";
import * as _ from "lodash";
import { ColumnSearchHeader } from "../ColumnSelector/ColumnListHeader/ColumnSearchHeader/ColumnSearchHeader";
const ColumnList = lazy(
  () => import("../ColumnSelector/ColumnList/ColumnList")
);

const cx: CX = classnames.bind(styles);

interface IProps {
  onContinue: () => void;
}

export const EditColumnSelector: FC<IProps> = ({ onContinue }) => {
  const { reset, handleSubmit, watch } = useFormContext<RData>();
  const [searchValue, setSearchValue] = useState<string>("");
  const { reportName, reportType } = useAppSelector(
    (state: RootState) => state.report
  );
  const { filters, setFilters, isLoading, reportFilters } =
    useEditColumnSelector();
  const dispatch = useAppDispatch();
  const { isChecked, handleCheckedAll, handleResetAll } = useHandleCheckboxAll(
    filters,
    setFilters
  );

  const handleCloseColumnSelector = useCallback(() => {
    const isBasicReportChanges =
      watch(EDataKeys.REPORT_TITLE) === reportName ||
      watch(EDataKeys.REPORT_TYPE) === reportType;
    const forCheck = _.map(reportFilters, (item) => ({
      ...item,
      selectedTableCell: item.selectedTableCell,
      selectedTableFilter: item.selectedTableFilter,
    }));
    const filterArray = (array: IIFilters[]) =>
      array.filter(
        ({ selectedTableCell, selectedTableFilter }) =>
          selectedTableCell || selectedTableFilter
      );
    const filteredForCheck = filterArray(forCheck);
    const filteredFilters = filterArray(filters);

    const arraysHaveSameLength =
      filteredForCheck.length === filteredFilters.length;
    if (isBasicReportChanges && arraysHaveSameLength) {
      dispatch(setEditColumnSelectorOpen(false));
      reset();
    } else {
      dispatch(setIsUnsavedChanges(true));
    }
  }, [dispatch, filters, reportFilters, reportName, reportType, reset, watch]);

  const onSubmit = useCallback(
    (data: RData) => {
      console.log(data);
      onContinue();
    },
    [onContinue]
  );

  const handleResetColumns = useCallback(() => {
    handleResetAll();
  }, [handleResetAll]);

  const handleBack = useCallback(() => {
    dispatch(setEditColumnSelectorOpen(false));
    dispatch(setReportEditOpen(true));
  }, [dispatch]);

  const handleSearchChange = useCallback((newValue: string) => {
    setSearchValue(newValue);
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={cx("edit-column-selector")}>
        <PopupHeader
          title={"Edit Set of Report Columns and Filters"}
          onClose={handleCloseColumnSelector}
        />
        <div className={cx("edit-column-wrapper")}>
          <div className={cx("search-wrapper")}>
            <ColumnSearchHeader
              isChecked={isChecked}
              handleCheckedAll={handleCheckedAll}
              isLoading={isLoading}
              handleSearchChange={handleSearchChange}
              searchValue={searchValue}
            />
          </div>

          <div className={cx("column-list")}>
            <ColumnListHeader />
            <SimpleBar
              style={{ maxHeight: "403px" }}
              className="my-custom-scrollbar-column"
            >
              {isLoading ? (
                <div className={cx("is-loading")}>
                  <DotSpinner />
                </div>
              ) : (
                <Suspense
                  fallback={
                    <div className={cx("is-loading")}>
                      <DotSpinner />
                    </div>
                  }
                >
                  <ColumnList
                    searchValue={searchValue}
                    filters={filters}
                    setFilters={setFilters}
                  />
                </Suspense>
              )}
            </SimpleBar>
          </div>
        </div>
        <ButtonWrapper shift={"left"}>
          <Button
            primary
            type="submit"
            title="Configure filters"
            style={{ width: "132px" }}
          />
          <Button
            title="Reset Columns"
            onClick={handleResetColumns}
            style={{ width: "128px", marginLeft: "16px" }}
          />
          <Button
            title="Back"
            onClick={handleBack}
            style={{ width: "128px", marginLeft: "16px" }}
          />
        </ButtonWrapper>
      </div>
    </form>
  );
};
