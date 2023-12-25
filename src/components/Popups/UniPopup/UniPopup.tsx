import { CSSProperties, FC } from "react";
import styles from "./UniPopup.module.scss";
import classnames from "classnames/bind";

const cx: CX = classnames.bind(styles);

interface IProps {
  position: { top: number; left: number };
  description?: string;
  top?: number;
  left?: number;
  customStyle?: CSSProperties,
}
export const UniPopup: FC<IProps> = ({ position, description, top = 0, left = 0, customStyle = {} }) => {
  const style: CSSProperties = {
    top: position.top + window.scrollY + top,
    left: position.left + window.scrollX - left,
    ...customStyle,
  };
  if (!description) {
    return null;
  }

  return (
    <div style={style} className={cx("uni-popup")}>
      <span>{description}</span>
    </div>
  );
};
