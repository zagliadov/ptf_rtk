import { FC } from "react";
import classnames from "classnames/bind";
import styles from "./ColumnSearchHeader.module.scss";
import { ReactComponent as CheckboxIcon } from "src/assets/icons/checkbox-icon.svg";
import Search from "src/components/Search";
const cx: CX = classnames.bind(styles);

interface IProps {
  isChecked: boolean;
  handleCheckedAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  handleSearchChange: (value: string) => void;
  searchValue: string;
}

export const ColumnSearchHeader: FC<IProps> = ({
  isChecked,
  handleCheckedAll,
  isLoading,
  handleSearchChange,
  searchValue,
}) => {
  return (
    <div className={cx("search-wrapper")}>
      <Search
        onChange={handleSearchChange}
        value={searchValue}
        placeholder={"Search by Column"}
        width={"269px"}
      />
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
        </div>
      </div>
    </div>
  );
};
