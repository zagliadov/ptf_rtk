import { CSSProperties, FC } from "react";
import styles from "./BookmarkInfoPopup.module.scss";
import classnames from "classnames/bind";

const cx: CX = classnames.bind(styles);

interface IProps {
  position: { top: number; left: number };
}
export const BookmarkInfoPopup: FC<IProps> = ({ position }) => {
  const style: CSSProperties = {
    top: position.top + window.scrollY - 50,
    left: position.left + window.scrollX - 18,
  };

  return (
    <div style={style} className={cx("bookmark-info-popup")}>
      <span>Click to pin it to the report main view</span>
    </div>
  );
};