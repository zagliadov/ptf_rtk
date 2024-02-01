import { FC, useEffect, useState } from "react";
import styles from "./DotThreeMenu.module.scss";
import classnames from "classnames/bind";
import { ReactComponent as EditIcon } from "src/assets/icons/edit-report-icon.svg";
import { ReactComponent as CopyIcon } from "src/assets/icons/copy-report-icon.svg";
import { ReactComponent as DeleteIcon } from "src/assets/icons/delete-report-icon.svg";
import { RootState, useAppDispatch, useAppSelector } from "src/store/store";
import {
  setReportEditOpen,
  setIsDeleteEntryOpen,
  setIsDotThreeMenuOpen,
  setCreateCopyReportOpen,
} from "src/store/managerSlice";
import { useGetReportQuery } from "src/store/services/customReportApi";
import * as _ from "lodash";

const cx = classnames.bind(styles);

export const DotThreeMenu: FC = () => {
  const dispatch = useAppDispatch();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const { reportId } = useAppSelector((state: RootState) => state.report);
  const { userResources, userEmail } = useAppSelector(
    (state: RootState) => state.auth
  );
  const { data } = useGetReportQuery(Number(reportId));

  const handleDeleteReport = () => {
    dispatch(setIsDeleteEntryOpen(true));
    dispatch(setIsDotThreeMenuOpen(false));
  };

  const handleEditReport = () => {
    dispatch(setReportEditOpen(true));
    dispatch(setIsDotThreeMenuOpen(false));
  };

  const handleCopyReport = () => {
    dispatch(setCreateCopyReportOpen(true));
    dispatch(setIsDotThreeMenuOpen(false));
  };

  useEffect(() => {
    if (_.isEmpty(data)) return setIsDisabled(false);
    const { email } = userResources.find(
      (resource: any) => resource.email === data[0]["Report Creator Email"]
    );
    if (email !== userEmail) setIsDisabled(true);
  }, [data, userEmail, userResources]);

  return (
    <div className={cx("dot-three-menu")}>
      <button onClick={handleEditReport} disabled={isDisabled}>
        <EditIcon />
        <span>Edit Report</span>
      </button>
      <button onClick={handleCopyReport}>
        <CopyIcon />
        <span>Copy Report</span>
      </button>
      <button onClick={handleDeleteReport}>
        <DeleteIcon />
        <span>Delete Report</span>
      </button>
    </div>
  );
};
