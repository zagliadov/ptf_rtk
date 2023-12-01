import { FC } from "react";
import styles from "./SideMenuFooter.module.scss";
import classnames from "classnames/bind";
import { Button } from "src/components/Button/Button";
import { setCreateNewReportOpen, setReportIsEdit } from "src/store/managerSlice";
import { useAppDispatch } from "src/store/store";

const cx: CX = classnames.bind(styles);

export const SideMenuFooter: FC = () => {
  const dispatch = useAppDispatch();

  const handleBuildNewReport = (): void => {
    dispatch(setReportIsEdit(false));
    dispatch(setCreateNewReportOpen(true));
  };
  return (
    <div className={cx("side-menu-footer")}>
      <Button
        primary
        title="Build New Report"
        onClick={handleBuildNewReport}
        style={{ width: "231px" }}
      />
    </div>
  );
};
