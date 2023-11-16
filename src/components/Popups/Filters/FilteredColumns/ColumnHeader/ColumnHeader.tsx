import { FC } from "react";
import styles from "./ColumnHeader.module.scss";
import classnames from "classnames/bind";
import { ReactComponent as DnDIcon } from "src/assets/icons/drag-and-drop-icon.svg";
import { ReactComponent as BookmarkIcon } from "src/assets/icons/bookmark-icon.svg";

const cx: CX = classnames.bind(styles);

interface IProps {
  item: any;
}

export const ColumnHeader: FC<IProps> = ({ item }) => {
  return (
    <div className={cx("column-header")}>
      <div className={cx("drag-and-drop-icon")}>
        <DnDIcon />
      </div>
      <div className={cx("bookmark-icon")}>
        <BookmarkIcon />
      </div>
      
      <span className={cx("column-name")}>
        {item.name} {item.type}
      </span>
    </div>
  );
};
