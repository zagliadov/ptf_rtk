import { FC, useState } from "react";
import styles from "./NotReportCreatorPopup.module.scss";
import classnames from "classnames/bind";
import { PopupHeader } from "../PopupHeader/PopupHeader";
import { Button } from "src/components/Button/Button";
import { useAppDispatch } from "src/store/store";
import { setIsNotReportCreator } from "src/store/managerSlice";
import * as _ from "lodash";

const cx: CX = classnames.bind(styles);

export const NotReportCreatorPopup: FC = () => {
  const dispatch = useAppDispatch();
  const handleClosePopup = () => {
    dispatch(setIsNotReportCreator(false));
  };

  return (
    <div className={cx("creator")}>
      <div className={cx("spec-header")}>
        <PopupHeader title={""} onClose={handleClosePopup} />
      </div>
      <div className={cx("description")}>
        <span className={cx("description-title")}>
          Order of columns will be not saved in the report settings as you are
          not the report creator.
        </span>
        <span className={cx("description-text")}>
          You can copy current report and set required ordering on the copy.
          That will not affect the scheduled reports.
        </span>
      </div>
      <div className={cx("button-wrapper")}>
        <Button
          primary
          title="Yes"
          type="submit"
          style={{ width: "100px" }}
          onClick={handleClosePopup}
        />
      </div>
    </div>
  );
};
