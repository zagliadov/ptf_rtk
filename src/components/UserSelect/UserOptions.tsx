import { CSSProperties, FC } from "react";
import classNames from "classnames/bind";
import styles from "./MUSelect.module.scss";
import BasicCheckbox from "src/components/BasicCheckbox/BasicCheckbox";

const cx = classNames.bind(styles);
interface IProps {
  position: { top: number; left: number };
  toggleCheckbox: any;
  handleSearchChange: any;
  logSelectedCheckboxes: any;
  searchValue: string;
  checkboxState: any;
  isVisible: boolean;
  top?: number;
  right?: number;
  width?: string;
  name?: string;
  id?: any;
}
export const UserOptions: FC<IProps> = ({
  position,
  toggleCheckbox,
  handleSearchChange,
  logSelectedCheckboxes,
  searchValue,
  checkboxState,
  isVisible,
  top = 44,
  right,
  width,
  name,
  id,
}) => {

  const style: CSSProperties = {
    top: position.top + top,
    ...(right !== undefined ? { right } : { left: position.left - 180 }),
    position: "absolute",
    zIndex: 100,
    width,
  };

  return (
    <div
      className={cx("custom-menu-list", isVisible && "active")}
      style={style}
    >
      <div className={cx("wrapper")}>
        <input
          id={String(id)}
          name={name}
          type={"text"}
          placeholder={name}
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>

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
