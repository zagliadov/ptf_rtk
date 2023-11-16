import { FC } from "react";
import styles from "./Popup.module.scss";
import classnames from "classnames/bind";

const cx: CX = classnames.bind(styles);

interface IProps {
  children: React.ReactElement;
  align?: string;
  open: boolean;
}
export const Popup: FC<IProps> = ({ children, align = "center", open }) => {
  if (!open) return null;
  return <div className={cx("popup-wrapper", align)}>{children}</div>;
};
