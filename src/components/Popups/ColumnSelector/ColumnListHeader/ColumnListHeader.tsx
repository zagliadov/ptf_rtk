import { FC } from "react";
import classnames from "classnames/bind";
import styles from "./ColumnListHeader.module.scss";
import { ReactComponent as CheckboxIcon } from "src/assets/icons/checkbox-icon.svg";
const cx: CX = classnames.bind(styles);

interface IProps {
  isChecked: boolean;
  handleCheckedAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}

export const ColumnListHeader: FC<IProps> = ({ isChecked, handleCheckedAll, isLoading }) => {

  return (
    <div className={cx("column-list-header")}>
      <div className={cx("select-all")}>
        <label htmlFor={"select-all"}>
          <input
            id={"select-all"}
            type="checkbox"
            checked={!isLoading && isChecked}
            onChange={handleCheckedAll}
          />
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
