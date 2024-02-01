import { CSSProperties, FC } from "react";
import ReactDOM from "react-dom";
import styles from "./Tooltip.module.scss";
import classnames from "classnames/bind";
import * as _ from "lodash";

const cx = classnames.bind(styles);

interface TooltipProps {
  currentName: string | null;
  content: string[];
  position: { top: number; left: number };
}

export const Tooltip: FC<TooltipProps> = ({ currentName, content, position }) => {
  const style: CSSProperties = {
    top: position.top + window.scrollY - 158,
    left: position.left + window.scrollX - 15,
  };

  const tooltipElement: JSX.Element = (
    <div className={cx("tooltip")} style={style}>
      <div className={cx("tooltip-header")}>
        <span>{currentName}</span>
      </div>
      <div className={cx("tooltip-body")}>
        {!_.isEmpty(content) &&
          _.map(content, (line, index) => (
            <span key={index} className={cx("tooltip-line")}>
              <span className={cx("dot-line")}>•</span> {line}
            </span>
          ))}
      </div>
    </div>
  );

  return ReactDOM.createPortal(tooltipElement, document.body);
};

export default Tooltip;
