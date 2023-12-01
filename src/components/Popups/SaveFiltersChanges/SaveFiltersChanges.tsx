import { FC, useCallback } from "react";
import styles from "./SaveFiltersChanges.module.scss";
import classnames from "classnames/bind";
import { PopupHeader } from "../PopupHeader/PopupHeader";
import { ButtonWrapper } from "src/components/ButtonWrapper/ButtonWrapper";
import { Button } from "src/components/Button/Button";
import { useAppDispatch } from "src/store/store";
import {
  setIsFiltersOpen,
  setReportEditAndSaveNewReport,
} from "src/store/managerSlice";
import { DynamicFormData, EDataKeys } from "src/types";
import { useFormContext } from "react-hook-form";
import { setSelectedFilters, setReportData, setFilterArray } from "src/store/filtersSlice";

const cx: CX = classnames.bind(styles);
export const SaveFiltersChanges: FC = () => {
  const { handleSubmit, reset } = useFormContext<DynamicFormData>();
  const dispatch = useAppDispatch();

  const handleCloseSaveFiltersChanges = useCallback((): void => {
    console.log("handleCloseSaveFiltersChanges");
    dispatch(setReportEditAndSaveNewReport(false));
  }, [dispatch]);

  const onSubmit = useCallback(
    (data: DynamicFormData): void => {
      console.log(data, "handleSaveEdits");
      dispatch(setSelectedFilters(data[EDataKeys.FILTERED_LIST]));
      localStorage.setItem("reportTitle", data[EDataKeys.REPORT_TITLE]);
      localStorage.setItem("dataSource", data[EDataKeys.DATA_SOURCE]);
      localStorage.setItem("reportType", data[EDataKeys.REPORT_TYPE]);
      dispatch(
        setReportData({
          reportTitle: data[EDataKeys.REPORT_TITLE],
          dataSource: data[EDataKeys.DATA_SOURCE],
          reportType: data[EDataKeys.REPORT_TYPE],
        })
      );
      // test..
      dispatch(setFilterArray(data[EDataKeys.FILTERS]));
      //...
      dispatch(setIsFiltersOpen(false));
      dispatch(setReportEditAndSaveNewReport(false));
      reset();
    },
    [dispatch, reset]
  );

  const handleClosePopup = useCallback((): void => {
    console.log("handleClosePopup");
    dispatch(setReportEditAndSaveNewReport(false));
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
            Are you sure? All changes will saved in default view
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
