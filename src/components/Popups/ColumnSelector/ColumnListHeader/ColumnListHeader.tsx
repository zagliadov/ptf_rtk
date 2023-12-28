import { FC } from "react";
import classnames from "classnames/bind";
import styles from "./ColumnListHeader.module.scss";
const cx: CX = classnames.bind(styles);


export const ColumnListHeader: FC = () => {
  return (
    <div className={cx("column-list-header")}>
      <div className={cx("left-side")}>
        <span>Columns</span>
        <span>Filters</span>
      </div>
      <div className={cx("right-side")}>
        <span>Columns</span>
        <span>Filters</span>
      </div>
    </div>
  );
};
