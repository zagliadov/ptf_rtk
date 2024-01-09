import { useState, FC, useEffect, ChangeEvent } from "react";
import classNames from "classnames/bind";
import styles from "./MUCSelect.module.scss";
import ReactDOM from "react-dom";
import { useHoverPositionVisibility } from "src/hook/useHoverPositionVisibility";
import { MUCOption } from "./MUCOption";
import { ReactComponent as CloseIcon } from "src/assets/icons/close-icon.svg";
import { ReactComponent as CaretBottomIcon } from "src/assets/icons/caret-down-icon.svg";
import { RootState, useAppSelector } from "src/store/store";
import { UpdatedChoice } from "src/types";
const cx = classNames.bind(styles);

interface Colorization {
  pattern: string;
  color: string;
}

interface SelectedItem {
  value: string;
  label: string;
  colorization: Colorization[];
}

interface IProps {
  item: any;
  updateFilters?: (id: number, value: any) => void;
  handleSelectChange?: any;
  updatedChoices?: UpdatedChoice[] | null;
  top?: number;
  right?: number;
  width?: string;
}
export const MUCSelect: FC<IProps> = ({
  item: { name, choice, id },
  handleSelectChange,
  updateFilters,
  updatedChoices,
  top,
  right,
  width,
}) => {
  const { isVisible, position, handleMouseClick, handleMouseLeave } =
    useHoverPositionVisibility({});
  const { reportName } = useAppSelector((state: RootState) => state.report);
  const [searchValue, setSearchValue] = useState("");
  const [filteredChoice, setFilteredChoice] = useState<any>(updatedChoices);
  const [selectedItems, setSelectedItems] = useState<any>([]);

  useEffect(() => {
    setSearchValue("");
  }, [reportName]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value.length === 0) {
      setFilteredChoice(updatedChoices);
    }

    const choices = updatedChoices?.filter((choice) =>
      choice.label.toLowerCase().includes(value.toLowerCase())
    );
    if (choices) {
      setFilteredChoice(choices);
    }
  };

  useEffect(() => {
    if (choice) {
      try {
        const choiceItem = JSON.parse(choice);
        if (typeof choiceItem === "string") {
          const choices = updatedChoices?.filter((item) =>
            item.label.toLowerCase().includes(choiceItem.toLowerCase())
          );
          setSelectedItems(choices);
        } else if (Array.isArray(choiceItem)) {
          const choices = updatedChoices?.filter((item) =>
            choiceItem.includes(item.label)
          );
          setSelectedItems(choices);
        }
      } catch (e) {
        console.error("Error parsing JSON:", e);
      }
    } else {
      setSearchValue("");
      setFilteredChoice(updatedChoices);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choice]);

  const handleClear = () => {
    handleSelectChange && handleSelectChange("", name);
    updateFilters && updateFilters(id, filteredLabels);
    setSearchValue("");
    setFilteredChoice(updatedChoices);
    setSelectedItems([]);
  };

  const filteredLabels = selectedItems
    ?.map((choice: any) => choice.label)
    .join(", ");
  return (
    <div className={cx("mu-select")} onMouseLeave={handleMouseLeave}>
      <div
        className={cx("input-wrapper", isVisible && "active")}
        onClick={handleMouseClick}
      >
        <div className={cx("search-value-wrapper")}>
          <span>{filteredLabels}</span>
        </div>
        <div className={cx("control-wrapper")}>
          {`(${selectedItems?.length})`}
          <div className={cx("mu-select-close-icon")}>
            {selectedItems.length > 0 && <CloseIcon onClick={handleClear} />}
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
          <MUCOption
            position={position}
            handleSearchChange={handleSearchChange}
            searchValue={searchValue}
            isVisible={isVisible}
            updatedChoices={filteredChoice}
            top={top}
            right={right}
            width={width}
            name={name}
            id={id}
            handleSelectChange={handleSelectChange}
            updateFilters={updateFilters}
            setSelectedItems={setSelectedItems}
            selectedItems={selectedItems}
          />,
          document.body
        )}
    </div>
  );
};
