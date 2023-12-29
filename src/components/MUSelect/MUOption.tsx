import { CSSProperties, FC } from "react";
import classNames from "classnames/bind";
import styles from "./MUSelect.module.scss";
import Search from "src/components/Search";
import BasicCheckbox from "src/components/BasicCheckbox/BasicCheckbox";

const cx = classNames.bind(styles);
interface IProps {
  position: { top: number; left: number };
  toggleCheckbox: any;
  handleSearchChange: any;
  logSelectedCheckboxes: any;
  searchValue: string;
  checkboxState: any;
}
export const MUOption: FC<IProps> = ({
  position,
  toggleCheckbox,
  handleSearchChange,
  logSelectedCheckboxes,
  searchValue,
  checkboxState,
}) => {
  const style: CSSProperties = {
    top: position.top + 45,
    left: position.left - 180,
    position: "absolute",
  };
  return (
    <div className={cx("custom-menu-list")} style={style}>
      <Search
        onChange={handleSearchChange}
        value={searchValue}
        placeholder="Search"
        width="100%"
      />

      <div className={cx("clear-all-button-wrapper")}>
        <button
          className={cx("clear-all-button")}
          onClick={logSelectedCheckboxes}
        >
          Clear all
        </button>
      </div>
      {Object.entries(checkboxState).map(([key, value]: any) => (
        <div
          key={key}
          className={cx("checkbox-wrapper")}
          style={{
            paddingLeft: "10px",
            display: "flex",
            alignItems: "center",
            height: "44px",
          }}
        >
          <BasicCheckbox
            className={cx("checkbox", { "half-selected": !value })}
            checked={value}
            onChange={() => toggleCheckbox(key)}
            renderLabel={() => (
              <span
                style={{
                  fontSize: "14px",
                  lineHeight: "20px",
                  color: "#454A54",
                }}
              >
                {key}
              </span>
            )}
          />
        </div>
      ))}
    </div>
  );
};
