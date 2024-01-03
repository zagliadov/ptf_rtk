import { useState, FC, useEffect, ChangeEvent } from "react";
import classNames from "classnames/bind";
import styles from "./MUSelect.module.scss";
import ReactDOM from "react-dom";
import { useHoverPositionVisibility } from "src/hook/useHoverPositionVisibility";
import { MUOption } from "./MUOption";
import { ReactComponent as CloseIcon } from "src/assets/icons/close-icon.svg";
import { ReactComponent as CaretBottomIcon } from "src/assets/icons/caret-down-icon.svg";
import { RootState, useAppSelector } from "src/store/store";
const cx = classNames.bind(styles);

interface IProps {
  item: any;
  updateFilters?: (id: number, value: any) => void;
  handleSelectChange?: any;
  top?: number;
  right?: number;
  width?: string;
}
export const MUSelect: FC<IProps> = ({
  item: { name, choice, id },
  handleSelectChange,
  updateFilters,
  top,
  right,
  width,
}) => {
  const { isVisible, position, handleMouseClick, handleMouseLeave } =
    useHoverPositionVisibility({});
  const { reportName } = useAppSelector((state: RootState) => state.report);

  const [checkboxState, setCheckboxState] = useState({
    "All event types": false,
    Travel: false,
    "Resource Activity": false,
    Opening: false,
  });

  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setSearchValue("");
  }, [reportName]);

  const toggleCheckbox = (key: string) => {
    setCheckboxState((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    updateFilters && updateFilters(id, value);
    handleSelectChange && handleSelectChange(value, name);
  };

  const logSelectedCheckboxes = () => {
    const selectedCheckboxes = Object.entries(checkboxState)
      .filter(([_, value]) => value)
      .map(([key]) => key);
    console.log("Selected Checkboxes:", selectedCheckboxes);
    console.log("Search Value:", searchValue);
    setCheckboxState({
      "All event types": false,
      Travel: false,
      "Resource Activity": false,
      Opening: false,
    });
    setSearchValue("");
  };

  useEffect(() => {
    if (choice && typeof choice === "string") {
      try {
        const choiceItem: string = JSON.parse(choice);
        setSearchValue(choiceItem);
      } catch (e) {
        console.error("Error parsing JSON:", e);
      }
    } else {
      setSearchValue("");
    }
  }, [choice]);

  const handleClear = () => {
    handleSelectChange("", name);
    setSearchValue("");
  }

  return (
    <div className={cx("mu-select")}>
      <div
        className={cx("input-wrapper", isVisible && "active")}
        onClick={handleMouseClick}
      >
        <div className={cx("search-value-wrapper")}>
          <span>{searchValue}</span>
        </div>
        <div className={cx("control-wrapper")}>
          <div className={cx("mu-select-close-icon")}>
            {searchValue.length > 0 && (
              <CloseIcon onClick={handleClear} />
            )}
          </div>
          <div className={cx("mu-select-drop-icon")}>
            {isVisible ? (
              <CaretBottomIcon style={{ transition: "0.2s" }} />
            ) : (
              <CaretBottomIcon
                style={{ transform: "rotate(180deg)", transition: "0.2s" }}
              />
            )}
          </div>
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
            isVisible={isVisible}
            top={top}
            right={right}
            width={width}
            name={name}
            id={id}
            // handleMouseLeave={handleMouseLeave}
          />,
          document.body
        )}
    </div>
  );
};
