import React, { useId } from "react";
import classnames from "classnames/bind";
import { COLOR } from "src/constants";
import { ReactComponent as CheckIcon } from "src/assets/icons/checkbox-icon.svg";
import styles from "./BasicCheckbox.module.scss";

const cx: CX = classnames.bind(styles);

function BasicCheckbox({
  checked,
  disabled,
  onChange,
  renderLabel,
  isAllCheckbox,
  ...attributes
}: Props) {
  const inputId = useId();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!disabled) {
      onChange(event.target.checked, event);
    }
  }

  return (
    <div className={cx("basic-checkbox")}>
      <label
        htmlFor={inputId}
        className={cx({
          disabled,
        })}
      >
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          {...attributes}
        />
        <div className={cx("checkbox-wrapper", {"select-all": isAllCheckbox})}>
          {checked && (
            <CheckIcon
              color={disabled ? COLOR["grey"] : COLOR["white"]}
            />
          )}
        </div>
        <div className={cx("label-text")} >
          {renderLabel(checked, disabled || false)}
        </div>
      </label>
    </div>
  );
}

interface Props
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  checked: boolean;
  isAllCheckbox?: boolean;
  onChange: (
    checked: boolean,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  renderLabel: (checked: boolean, disabled: boolean) => React.ReactNode;
}

export default BasicCheckbox;
