import { FC } from "react";
import styles from "./DeleteEntry.module.scss";
import classnames from "classnames/bind";
import { PopupHeader } from "../PopupHeader/PopupHeader";
import { ButtonWrapper } from "src/components/ButtonWrapper/ButtonWrapper";
import { Button } from "src/components/Button/Button";
import { useAppDispatch, useAppSelector, RootState } from "src/store/store";
import { setIsDeleteEntryOpen } from "src/store/managerSlice";
import { deleteReport, setIsReportDelete } from "src/store/reportSlice";
import { useGetReportColumnQuery } from "src/store/services/reportColumnApi";
import * as _ from "lodash";

const cx: CX = classnames.bind(styles);

export const DeleteEntry: FC = () => {
  const dispatch = useAppDispatch();
  const { reportId, reportName } = useAppSelector(
    (state: RootState) => state.report
  );

  const { data } = useGetReportColumnQuery({});

  const handleCloseDeleteEntry = () => {
    dispatch(setIsDeleteEntryOpen(false));
  };

  const handleDeleteEntry = async () => {
    const filteredData = _.filter(
      data,
      (item) => item["Report Name"] === reportName
    );
    const columnIds = _.map(filteredData, "@row.id");
    if (reportId && !_.isEmpty(columnIds)) {
      await dispatch(deleteReport({ reportId, columnIds }))
        .then(() => {
          dispatch(setIsDeleteEntryOpen(false));
        })
        .then(() => {
          dispatch(setIsReportDelete(false));
        });
    }
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
