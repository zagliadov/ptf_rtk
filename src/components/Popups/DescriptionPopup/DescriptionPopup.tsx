import { CSSProperties, FC } from "react";
import styles from "./DescriptionPopup.module.scss";
import classnames from "classnames/bind";

const cx: CX = classnames.bind(styles);

interface IProps {
  position: { top: number; left: number };
  description?: string;
}
export const DescriptionPopup: FC<IProps> = ({ position, description }) => {
  const style: CSSProperties = {
    top: position.top + window.scrollY + 25,
    left: position.left + window.scrollX - 300,
  };
  if (!description) {
    return null;
  }

  return (
    <div style={style} className={cx("description-popup")}>
      <span>{description}</span>
    </div>
  );
};
