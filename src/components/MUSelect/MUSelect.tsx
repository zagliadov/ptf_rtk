import { useState, FC } from "react";
import classNames from "classnames/bind";
import styles from "./MUSelect.module.scss";
import ReactDOM from "react-dom";
import { useHoverPositionVisibility } from "src/hook/useHoverPositionVisibility";
import { MUOption } from "./MUOption";
import { ReactComponent as CloseIcon } from "src/assets/icons/close-icon.svg";
import { ReactComponent as CaretTopIcon } from "src/assets/icons/caret-top-icon.svg";
import { ReactComponent as CaretBottomIcon } from "src/assets/icons/caret-down-icon.svg";
const cx = classNames.bind(styles);

export const MUSelect: FC = () => {
  const { isVisible, position, handleMouseClick } = useHoverPositionVisibility(
    {}
  );

  const [checkboxState, setCheckboxState] = useState({
    "All event types": false,
    Travel: false,
    "Resource Activity": false,
    Opening: false,
  });

  const [searchValue, setSearchValue] = useState("");

  const toggleCheckbox = (key: string) => {
    setCheckboxState((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const logSelectedCheckboxes = () => {
    const selectedCheckboxes = Object.entries(checkboxState)
      .filter(([_, value]) => value)
      .map(([key]) => key);
    console.log("Selected Checkboxes:", selectedCheckboxes);
    console.log("Search Value:", searchValue);
  };
  console.log(isVisible, "asdf")
  return (
    <div className={cx("mu-select")}>
      <div onClick={handleMouseClick} className={cx("input-wrapper")}>
        <div className={cx("mu-select-close-icon")}>
          { searchValue.length > 0 && <CloseIcon /> }
        </div>
        <div className={cx("mu-select-drop-icon")}>
          {isVisible ? <CaretBottomIcon /> : <CaretBottomIcon style={{transform: "rotate(180deg)" }}/>}
        </div>
      </div>
      {isVisible &&
        ReactDOM.createPortal(
          <MUOption
            position={position}
            toggleCheckbox={toggleCheckbox}
            handleSearchChange={handleSearchChange}
            logSelectedCheckboxes={logSelectedCheckboxes}
            searchValue={searchValue}
            checkboxState={checkboxState}
          />,
          document.body
        )}
    </div>
  );
};
