import { FC, useCallback } from "react";
import styles from "./SaveFiltersChanges.module.scss";
import classnames from "classnames/bind";
import { PopupHeader } from "../PopupHeader/PopupHeader";
import { ButtonWrapper } from "src/components/ButtonWrapper/ButtonWrapper";
import { Button } from "src/components/Button/Button";
import { useAppDispatch } from "src/store/store";
import {
  setIsSaveNewReportOpen,
  setIsFiltersOpen,
} from "src/store/managerSlice";
import { DynamicFormData, EDataKeys } from "src/types";
import { useFormContext } from "react-hook-form";
import { setSelectedFilters } from "src/store/filtersSlice";

const cx: CX = classnames.bind(styles);
export const SaveFiltersChanges: FC = () => {
  const { handleSubmit } = useFormContext<DynamicFormData>();
  const dispatch = useAppDispatch();

  const handleCloseSaveFiltersChanges = useCallback((): void => {
    console.log("handleCloseSaveFiltersChanges");
    dispatch(setIsSaveNewReportOpen(false));
  }, [dispatch]);

  const onSubmit = useCallback(
    (data: DynamicFormData): void => {
      console.log(data, "handleSaveEdits");
      dispatch(setSelectedFilters(data[EDataKeys.FILTERED_LIST]));
      dispatch(setIsSaveNewReportOpen(false));
      dispatch(setIsFiltersOpen(false));
    },
    [dispatch]
  );

  const handleClosePopup = useCallback((): void => {
    console.log("handleClosePopup");
    dispatch(setIsSaveNewReportOpen(false));
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
