import { FC } from "react";
import styles from "./ToggleButton.module.scss";
import classnames from "classnames/bind";
import { EDataKeys } from "src/types";

const cx: CX = classnames.bind(styles);

interface IProps {
  onChange: (value: EDataKeys.INTERNAL | EDataKeys.EXTERNAL) => void;
  value: EDataKeys.INTERNAL | EDataKeys.EXTERNAL;
  error: string | undefined;
  disabled: boolean;
}
export const ToggleButton: FC<IProps> = ({ onChange, value, error, disabled }) => {
  const handleOptionChange = (option: string, e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    if (Object.values(EDataKeys).includes(option as EDataKeys)) {
      onChange(option as EDataKeys.INTERNAL | EDataKeys.EXTERNAL);
    }
  };

  const isErrorBorder: boolean | "" | undefined = error && ![EDataKeys.INTERNAL, EDataKeys.EXTERNAL].includes(value as EDataKeys);

  return (
    <div className={cx("toggle-button-wrapper", { 'error-border': isErrorBorder })}>
      <button
        disabled={disabled}
        className={cx(
          "toggle-button",
          value === EDataKeys.INTERNAL ? "active" : ""
        )}
        onClick={(e) => handleOptionChange(EDataKeys.INTERNAL, e)}
      >
        Internal
      </button>
      <button
        disabled={disabled}
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
