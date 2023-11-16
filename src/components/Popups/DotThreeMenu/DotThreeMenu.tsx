import { FC } from "react";
import styles from "./DotThreeMenu.module.scss";
import classnames from "classnames/bind";
import { ReactComponent as EditIcon } from "src/assets/icons/edit-report-icon.svg";
import { ReactComponent as CopyIcon } from "src/assets/icons/copy-report-icon.svg";
import { ReactComponent as DeleteIcon } from "src/assets/icons/delete-report-icon.svg";
import { useAppDispatch } from "src/store/store";
import {
  setIsDeleteEntryOpen,
  setIsDotThreeMenuOpen,
  setIsFiltersOpen,
} from "src/store/managerSlice";
const cx = classnames.bind(styles);

export const DotThreeMenu: FC = () => {
  const dispatch = useAppDispatch();

  const handleDeleteReport = () => {
    dispatch(setIsDeleteEntryOpen(true));
    dispatch(setIsDotThreeMenuOpen(false));
  };

  const handleEditReport = () => {
    dispatch(setIsFiltersOpen(true));
    dispatch(setIsDotThreeMenuOpen(false));
  };

  const handleCopyReport = () => {
    console.log("Copy Report");
  };

  return (
    <div className={cx("dot-three-menu")}>
      <button onClick={handleEditReport}>
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
