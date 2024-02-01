import { FC, useState } from "react";
import styles from "./SaveFilterChanges.module.scss";
import classnames from "classnames/bind";
import { PopupHeader } from "../PopupHeader/PopupHeader";
import { ButtonWrapper } from "src/components/ButtonWrapper/ButtonWrapper";
import { Button } from "src/components/Button/Button";
import { RootState, useAppDispatch, useAppSelector } from "src/store/store";
import { confirmFilterChanges } from "src/store/managerSlice";
import * as _ from "lodash";
import useReportData from "src/hook/useReportData";
import { setUserInteracted, updateFilterChoice } from "src/store/filtersSlice";

const cx: CX = classnames.bind(styles);
export const SaveFilterChanges: FC = () => {
  const { filterChoice } = useAppSelector((state: RootState) => state.filters);
  const [isSaving, setIsSaving] = useState(false);
  const { refetchReports } = useReportData();
  const dispatch = useAppDispatch();

  const handleSaveFilterChanges = async () => {
    if (filterChoice && !isSaving) {
      setIsSaving(true);
      await dispatch(
        updateFilterChoice({
          reportName: filterChoice.reportName,
          filterName: filterChoice.filterName,
          newChoice: filterChoice.choice,
        })
      );
      dispatch(confirmFilterChanges(false));
      refetchReports();
    }
  };

  const handleClosePopup = () => {
    dispatch(confirmFilterChanges(false));
    dispatch(setUserInteracted(false));
  };

  return (
    <div className={cx("save-filter-changes")}>
      <div className={cx("spec-header")}>
        <PopupHeader title={""} onClose={handleClosePopup} />
      </div>
      <div className={cx("description")}>
        <span className={cx("description-title")}>
          Important! You are going to apply filters and that can or can not
          affect the settings of the current report.
        </span>
        <span className={cx("description-text")}>
          Click “No” to apply the filter without adjustment of the report
          settings (once page is reloaded, filter will be reset to default).
          Click “Yes” to save applied filter as a setting for the report (this
          will affect scheduled reports)
        </span>
      </div>
      <ButtonWrapper shift={"center"}>
        <Button
          primary
          title="Yes"
          type="submit"
          style={{ width: "100px" }}
          onClick={handleSaveFilterChanges}
          disabled={isSaving}
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
