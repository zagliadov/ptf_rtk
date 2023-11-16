import { FC } from "react";
import styles from "./DeleteEntry.module.scss";
import classnames from "classnames/bind";
import { PopupHeader } from "../PopupHeader/PopupHeader";
import { ButtonWrapper } from "src/components/ButtonWrapper/ButtonWrapper";
import { Button } from "src/components/Button/Button";
import { useAppDispatch } from "src/store/store";
import { setIsDeleteEntryOpen } from "src/store/managerSlice";

const cx: CX = classnames.bind(styles);

export const DeleteEntry: FC = () => {
  const dispatch = useAppDispatch();
  const handleCloseDeleteEntry = () => {
    console.log("handleCloseDeleteEntry");
    dispatch(setIsDeleteEntryOpen(false));
  };
  const handleDeleteEntry = () => {
    dispatch(setIsDeleteEntryOpen(false));
  };
  const handleClosePopup = () => {
    dispatch(setIsDeleteEntryOpen(false));
  };
  return (
    <div className={cx("delete-entry")}>
      <div className={cx("spec-header")}>
        <PopupHeader title={""} onClose={handleCloseDeleteEntry} />
      </div>
      <div className={cx("description")}>
        <span className={cx("description-title")}>
          You are going to delete the Entry
        </span>
        <span className={cx("description-text")}>
          Click Yes to proceed, or No to cancel
        </span>
      </div>
      <ButtonWrapper shift={"center"}>
        <Button
          primary
          title="Yes"
          onClick={handleDeleteEntry}
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
