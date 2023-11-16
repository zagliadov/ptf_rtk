import { FC } from "react";
import styles from "./PopupHeader.module.scss";
import classnames from "classnames/bind";
import { ReactComponent as CloseIcon } from "src/assets/icons/close-icon.svg";

const cx: CX = classnames.bind(styles);

interface IProps {
  title: string;
  onClose?: () => void;
  description?: string;
}
export const PopupHeader: FC<IProps> = ({ title, onClose, description }) => {
  return (
    <div className={cx("popup-header")}>
      <div>
        <span className={cx("popup-title")}>{title}</span>
        <button type="button" onClick={onClose}>
          <CloseIcon />
        </button>
      </div>
      {description && (
        <span className={cx("popup-description")}>
          Apply filters, set the order and select favorites to build report
        </span>
      )}
    </div>
  );
};
