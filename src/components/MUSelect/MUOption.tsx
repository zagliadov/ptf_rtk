import { CSSProperties, FC, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./MUSelect.module.scss";
import { ReactComponent as SearchIcon } from "src/assets/icons/search-icon.svg";
import * as _ from "lodash";
import { CheckboxWithTooltip } from "./CheckboxWithTooltip";
import BasicCheckbox from "../BasicCheckbox/BasicCheckbox";
const cx = classNames.bind(styles);

interface IProps {
  position: { top: number; left: number };
  toggleCheckbox: any;
  handleSearchChange: any;
  handleShowOnlySelected: () => void;
  searchValue: string;
  isVisible: boolean;
  top?: number;
  right?: number;
  width?: string;
  name?: string;
  id?: any;
  checkboxState: any;
  extractData: any;
  setFilteredState: any;
  isShowAll: boolean;
  isAllCheckbox: boolean;
  toggleAllCheckbox: () => void;
}
export const MUOption: FC<IProps> = ({
  position,
  toggleCheckbox,
  handleSearchChange,
  handleShowOnlySelected,
  searchValue,
  isVisible,
  top = 44,
  right,
  width,
  name,
  id,
  checkboxState,
  extractData,
  setFilteredState,
  isShowAll,
  isAllCheckbox,
  toggleAllCheckbox,
}) => {
  const style: CSSProperties = {
    top: position.top + top,
    ...(right !== undefined ? { right } : { left: position.left - 180 }),
    position: "absolute",
    zIndex: 100,
    width,
  };

  useEffect(() => {
    if (_.isEmpty(checkboxState)) {
      setFilteredState(extractData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = () => {
    handleShowOnlySelected();
  };

  const handleToggleAll = () => {
    toggleAllCheckbox();
  };

  return (
    <div
      className={cx("custom-menu-list", isVisible && "active")}
      style={style}
    >
      <div className={cx("wrapper")}>
        {searchValue.length === 0 && (
          <div className={cx("search-icon")}>
            <SearchIcon />
          </div>
        )}
        <input
          id={String(id)}
          name={name}
          type={"text"}
          placeholder={"Search"}
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>

      <div className={cx("clear-all-button-wrapper")}>
        <button className={cx("clear-all-button")} onClick={handleClick}>
          {isShowAll ? "Show all" : "Show only selected"}
        </button>
      </div>
      <div className={cx("checkbox-wrapper")}>
        <BasicCheckbox
          key={name}
          className={cx("checkbox", { "half-selected": !name })}
          checked={isAllCheckbox}
          onChange={handleToggleAll}
          isAllCheckbox={true}
          renderLabel={() => (
            <span className={cx("checkbox-label", { isApplied: !width })}>
              All
            </span>
          )}
        />
      </div>
      {checkboxState &&
        Object.entries(checkboxState).map(([key, value]: any) => (
          <CheckboxWithTooltip
            key={key}
            label={key}
            value={value}
            toggleCheckbox={toggleCheckbox}
            width={width}
          />
        ))}
    </div>
  );
};
