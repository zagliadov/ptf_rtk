import { FC, useCallback } from "react";
import styles from "./SaveFiltersChanges.module.scss";
import classnames from "classnames/bind";
import { PopupHeader } from "../PopupHeader/PopupHeader";
import { ButtonWrapper } from "src/components/ButtonWrapper/ButtonWrapper";
import { Button } from "src/components/Button/Button";
import { RootState, useAppDispatch, useAppSelector } from "src/store/store";
import {
  setIsEditFiltersOpen,
  setIsSaveFiltersChangesOpen,
} from "src/store/managerSlice";
import { DynamicFormData, EDataKeys } from "src/types";
import { useFormContext } from "react-hook-form";
import { setSelectedFilters } from "src/store/filtersSlice";
import { useGetReportColumnQuery } from "src/store/services/reportColumnApi";
import * as _ from "lodash";
import { createReport, deleteReport } from "src/store/reportSlice";

const cx: CX = classnames.bind(styles);
export const SaveFiltersChanges: FC = () => {
  const { handleSubmit, reset } = useFormContext<DynamicFormData>();
  const { data: ReportResult } = useGetReportColumnQuery({});
  const { reportId, reportName } = useAppSelector(
    (state: RootState) => state.report
  );
  const dispatch = useAppDispatch();

  const handleCloseSaveFiltersChanges = useCallback((): void => {
    dispatch(setIsEditFiltersOpen(false));
    dispatch(setIsSaveFiltersChangesOpen(false));
    reset();
  }, [dispatch, reset]);

  const onSubmit = useCallback(
    async (data: DynamicFormData): Promise<void> => {
      const filteredData = _.filter(
        ReportResult,
        (item) => item["Report Name"] === reportName
      );
      const columnIds = _.map(filteredData, "@row.id");
      if (reportId) {
        await dispatch(deleteReport({ reportId, columnIds, update: true }))
          .then(() => {
            dispatch(createReport(data));
          })
          .then(() => {
            dispatch(setSelectedFilters(data[EDataKeys.FILTERED_LIST]));
            dispatch(setIsEditFiltersOpen(false));
            dispatch(setIsSaveFiltersChangesOpen(false));
            reset();
          });
      }
    },
    [ReportResult, dispatch, reportId, reportName, reset]
  );

  const handleClosePopup = useCallback((): void => {
    dispatch(setIsSaveFiltersChangesOpen(false));
  }, [dispatch]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={cx("save-filters-changes")}>
        <div className={cx("spec-header")}>
          <PopupHeader title={""} onClose={handleCloseSaveFiltersChanges} />
        </div>
        <div className={cx("description")}>
          <span className={cx("description-title")}>
            You are going to save edits
          </span>
          <span className={cx("description-text")}>
            Are you sure? All changes will be saved in default view
          </span>
        </div>
        <ButtonWrapper shift={"center"}>
          <Button
            primary
            title="Yes"
            type="submit"
            style={{ width: "100px" }}
          />
          <Button
            title="No"
            onClick={handleClosePopup}
            style={{ width: "100px", marginLeft: "16px" }}
          />
        </ButtonWrapper>
      </div>
    </form>
  );
};
