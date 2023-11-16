import { FC, ReactNode } from "react";
import styles from "./ButtonWrapper.module.scss";
import classnames from "classnames/bind";

const cx: CX = classnames.bind(styles);

interface IProps {
  children: ReactNode[];
  shift: string;
}
export const ButtonWrapper: FC<IProps> = ({ children, shift = "" }) => {
  return <div className={cx("button-wrapper", shift)}>{children}</div>;
};
