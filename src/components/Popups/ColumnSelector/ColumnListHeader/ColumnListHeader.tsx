import { FC } from "react";
import classnames from "classnames/bind";
import styles from "./ColumnListHeader.module.scss";
import { ReactComponent as CheckboxIcon } from "src/assets/icons/checkbox-icon.svg";

const cx: CX = classnames.bind(styles);
export const ColumnListHeader: FC = () => {
  return (
    <div className={cx("column-list-header")}>
      <div className={cx("select-all")}>
        <label htmlFor={"select-all"}>
          <input id={"select-all"} type="checkbox" />
          <div className={cx("checkbox-wrapper")}>
            <div className={cx("checkbox-icon")}>
              <CheckboxIcon />
            </div>
          </div>
          <span>Select all</span>
        </label>
        <span>Filter</span>
      </div>
      <div className={cx("last-filter")}>
        <span>Filter</span>
      </div>
    </div>
  );
};
