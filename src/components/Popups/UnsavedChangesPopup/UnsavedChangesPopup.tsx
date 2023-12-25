import { FC, useCallback } from "react";
import styles from "./UnsavedChangesPopup.module.scss";
import classnames from "classnames/bind";
import { PopupHeader } from "../PopupHeader/PopupHeader";
import { ButtonWrapper } from "src/components/ButtonWrapper/ButtonWrapper";
import { Button } from "src/components/Button/Button";
import { useAppDispatch } from "src/store/store";
import { setEditColumnSelectorOpen, setIsEditFiltersOpen, setIsUnsavedChanges, setReportEditOpen } from "src/store/managerSlice";
import { DynamicFormData } from "src/types";
import { useFormContext } from "react-hook-form";

const cx: CX = classnames.bind(styles);

export const UnsavedChangesPopup: FC = () => {
  const { reset } = useFormContext<DynamicFormData>();
  const dispatch = useAppDispatch();

  const onSubmit = useCallback(
    (): void => {
      dispatch(setIsUnsavedChanges(false));
      dispatch(setReportEditOpen(false));
      dispatch(setEditColumnSelectorOpen(false));
      dispatch(setIsEditFiltersOpen(false));
      reset();
    },
    [dispatch, reset]
  );

  const handleClosePopup = useCallback((): void => {
    dispatch(setIsUnsavedChanges(false));
  }, [dispatch]);

  return (
      <div className={cx("unsaved-changes")}>
        <div className={cx("spec-header")}>
          <PopupHeader title={""} onClose={handleClosePopup} />
        </div>
        <div className={cx("description")}>
          <span className={cx("description-title")}>Are you sure?</span>
          <span className={cx("description-text")}>
            All changes will not be saved.
          </span>
        </div>
        <ButtonWrapper shift={"center"}>
          <Button
            primary
            title="Yes"
            type="button"
            onClick={onSubmit}
            style={{ width: "100px" }}
          />
          <Button
            title="No"
            onClick={handleClosePopup}
            style={{ width: "100px", marginLeft: "16px" }}
          />
        </ButtonWrapper>
      </div>
  );
};
