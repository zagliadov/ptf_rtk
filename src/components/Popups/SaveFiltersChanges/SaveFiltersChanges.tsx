import { FC } from "react";
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

const cx: CX = classnames.bind(styles);
export const SaveFiltersChanges: FC = () => {
  const dispatch = useAppDispatch();
  const handleCloseSaveFiltersChanges = () => {
    console.log("handleCloseSaveFiltersChanges");
    dispatch(setIsSaveNewReportOpen(false));
  };
  const handleSaveEdits = () => {
    console.log("handleSaveEdits");
    dispatch(setIsSaveNewReportOpen(false));
    dispatch(setIsFiltersOpen(false));
  };
  const handleClosePopup = () => {
    console.log("handleClosePopup");
    dispatch(setIsSaveNewReportOpen(false));
  };
  return (
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
          onClick={handleSaveEdits}
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
