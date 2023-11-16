import React, { forwardRef, ReactNode, ForwardedRef } from "react";
import classnames from "classnames/bind";
import styles from "./Input.module.scss";

const cx: CX = classnames.bind(styles);

type InputProps = {
  label?: string;
  name: string;
  placeholder?: string;
  error?: string | boolean;
  icon?: ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref: ForwardedRef<HTMLInputElement>) => {
  const { label, name, error, icon, ...rest } = props;
  return (
    <div className={cx("wrapper", { error })}>
      {icon && <div className={cx("icon")}>{icon}</div>}
      <input
        ref={ref}
        id={name}
        name={name}
        type="search"
        {...rest}
      />
    </div>
  );
});

Input.displayName = "Input";

export default Input;
