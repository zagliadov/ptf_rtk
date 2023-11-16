import React, { FC } from "react";
import ReactDOM from "react-dom";
import styles from "./Tooltip.module.scss";
import classnames from "classnames/bind";

const cx = classnames.bind(styles);

interface TooltipProps {
  content: string[];
  position: { top: number; left: number };
}

export const Tooltip: FC<TooltipProps> = ({ content, position }) => {
  const style: any = {
    position: "fixed",
    top: position.top + window.scrollY - 158,
    left: position.left + window.scrollX - 15,
    zIndex: 1000,
  };

  const tooltipElement = (
    <div className={cx("tooltip")} style={style}>
      <div className={cx("tooltip-header")}>
        <span>Report Title</span>
      </div>
      <ul>
        {content.map((line, index) => (
          <li key={index} className={cx("tooltip-line")}>
            {line}
          </li>
        ))}
      </ul>
    </div>
  );

  return ReactDOM.createPortal(tooltipElement, document.body);
};

export default Tooltip;
