import { useState } from "react";
import ReactDOM from "react-dom";
import BasicCheckbox from "../BasicCheckbox/BasicCheckbox";
import styles from "./MUSelect.module.scss";
import classNames from "classnames/bind";
import { UniPopup } from "../Popups/UniPopup/UniPopup";
import { RootState, useAppSelector } from "src/store/store";

const cx = classNames.bind(styles);
export const CheckboxWithTooltip = ({
  key,
  value,
  toggleCheckbox,
  label,
  width,
}: any) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const { isEditFiltersOpen } = useAppSelector(
    (state: RootState) => state.manager
  );
  const handleMouseEnter = (event: any) => {
    let shiftTop = -50;
    let shiftLeft = -210;
    if (!isEditFiltersOpen) {
      shiftTop = 20;
      shiftLeft = 130;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      top: rect.top + window.scrollY + shiftTop,
      left: rect.left + window.scrollX + shiftLeft,
    });
    setTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  const onEnter = (e: any) => {
    if (label.length > 16 && !isEditFiltersOpen) {
      handleMouseEnter(e);
    }
    if (label.length > 41 && isEditFiltersOpen) {
      handleMouseEnter(e);
    }
  };

  return (
    <div className={cx("checkbox-wrapper")} key={label}>
      <BasicCheckbox
        key={value}
        className={cx("checkbox", { "half-selected": !value })}
        checked={value}
        onChange={() => toggleCheckbox(label)}
        renderLabel={() => (
          <span
            className={cx("checkbox-label", { isApplied: !width })}
            onMouseEnter={onEnter}
            onMouseLeave={handleMouseLeave}
          >
            {label}
          </span>
        )}
      />
      {tooltipVisible &&
        ReactDOM.createPortal(
          <UniPopup
            position={tooltipPosition}
            description={label}
            customStyle={{
              width: "auto",
              borderTopRightRadius: "8px",
              borderTopLeftRadius: `${isEditFiltersOpen ? "8px" : "0px"}`,
              borderBottomRightRadius: `${isEditFiltersOpen ? "0px" : "8px"}`,
              borderBottomLeftRadius: "8px",
            }}
          />,
          document.body
        )}
    </div>
  );
};
