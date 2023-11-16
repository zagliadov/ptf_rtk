import { FC } from "react";
import styles from "./ToggleButton.module.scss";
import classnames from "classnames/bind";
import { EDataKeys } from "src/types";

const cx: CX = classnames.bind(styles);

interface IProps {
  onChange: (value: string) => void;
  value: string;
}
export const ToggleButton: FC<IProps> = ({ onChange, value }) => {
  const handleOptionChange = (option: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onChange(option);
  };

  return (
    <div className={cx("toggle-button-wrapper")}>
      <button
        className={cx(
          "toggle-button",
          value === EDataKeys.INTERNAL ? "active" : ""
        )}
        onClick={(e) => handleOptionChange(EDataKeys.INTERNAL, e)}
      >
        Internal
      </button>
      <button
        className={cx(
          "toggle-button",
          value === EDataKeys.EXTERNAL ? "active" : ""
        )}
        onClick={(e) => handleOptionChange(EDataKeys.EXTERNAL, e)}
      >
        External
      </button>
    </div>
  );
};
