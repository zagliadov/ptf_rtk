import { CSSProperties, FC, ReactNode } from "react";
import styles from "./Button.module.scss";
import classnames from "classnames/bind";

const cx: CX = classnames.bind(styles);

interface IProps extends React.HTMLProps<HTMLButtonElement> {
  primary?: boolean;
  notActive?: boolean;
  icon?: ReactNode;
  link?: string;
  btnSize?: "small" | "large";
  style?: CSSProperties;
}
export const Button: FC<IProps> = ({
  title,
  type,
  disabled,
  primary,
  notActive,
  onClick,
  icon,
  link,
  btnSize,
  target = "",
  style,
  ...rest
}) => {
  return link ? (
    <a
      target={target}
      href={link}
      className={cx("button", {
        primary: type === "submit" || primary,
        disabled,
        "not-active": notActive,
        small: btnSize === "small",
      })}
    >
      {icon && <div className={cx("icon")}>{icon}</div>}
      {title && <span className={cx("title")}>{title}</span>}
    </a>
  ) : (
    <button
      type={type === "submit" ? "submit" : "button"}
      onClick={onClick}
      aria-label={title}
      style={style}
      className={cx("button", {
        primary: type === "submit" || primary,
        disabled,
        "not-active": notActive,
        small: btnSize === "small",
      })}
      disabled={disabled}
      {...rest}
    >
      {icon && <div className={cx("icon")}>{icon}</div>}
      {title && <span className={cx("title")}>{title}</span>}
    </button>
  );
};
