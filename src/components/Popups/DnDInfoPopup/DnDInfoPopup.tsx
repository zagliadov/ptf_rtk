import { CSSProperties, FC } from "react";
import styles from "./DnDInfoPopup.module.scss";
import classnames from "classnames/bind";

const cx: CX = classnames.bind(styles);

interface IProps {
  position: { top: number; left: number };
}
export const DnDInfoPopup: FC<IProps> = ({ position }) => {
  const style: CSSProperties = {
    top: position.top + window.scrollY - 50,
    left: position.left + window.scrollX - 18,
  };

  return (
    <div style={style} className={cx("drag-and-drop-popup")}>
      <span>Click and pull down or top to change the order</span>
    </div>
  );
};
