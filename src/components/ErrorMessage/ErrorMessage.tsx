import { FC } from "react";
import styles from "./ErrorMessage.module.scss";
import classnames from "classnames/bind";

interface IProps {
  message?: string;
}
const cx: CX = classnames.bind(styles);
export const ErrorMessage: FC<IProps> = ({ message }) => {
  if (!message) return null;

  return <span className={cx("error-message")}>{message}</span>;
};
