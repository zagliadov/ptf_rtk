import { CSSProperties, FC, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./MUCSelect.module.scss";
import { Colorization, UpdatedChoice } from "src/types";
import * as _ from "lodash";

const cx = classNames.bind(styles);
interface IProps {
  position: { top: number; left: number };
  handleSelectChange: any;
  handleSearchChange: any;
  updatedChoices?: UpdatedChoice[] | null;
  setSelectedItems: any;
  selectedItems: any;
  updateFilters?: any;
  searchValue: string;
  isVisible: boolean;
  top?: number;
  right?: number;
  width?: string;
  name?: string;
  id?: number;
}
export const MUCOption: FC<IProps> = ({
  position,
  handleSelectChange,
  handleSearchChange,
  updatedChoices,
  selectedItems,
  setSelectedItems,
  updateFilters,
  searchValue,
  isVisible,
  top = 44,
  right,
  width,
  name,
  id,
}) => {
  const style: CSSProperties = {
    top: position.top + top,
    ...(right !== undefined ? { right } : { left: position.left - 180 }),
    position: "absolute",
    zIndex: 150,
    width,
  };

  const handleClick = (label: string) => {
    const choices = updatedChoices?.filter(
      (choice) => choice.label.toLowerCase() === label.toLowerCase()
    );
    setSelectedItems((prevState: any) => {
      const alreadySelected = _.some(choices, (choice) =>
        _.some(prevState, (item) => item.value === choice.value)
      );
      if (alreadySelected && choices) {
        return _.differenceWith(
          prevState,
          choices,
          (a: any, b: any) => a.value === b.value
        );
      } else {
        return _.unionWith(prevState, choices, (a, b) => a.value === b.value);
      }
    });
  };
  useEffect(() => {
    const selectedLabels = selectedItems?.map((item: any) => item.label);
    updateFilters && updateFilters(id, selectedLabels);
    handleSelectChange && handleSelectChange(selectedLabels, name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems]);

  return (
    <div
      className={cx("custom-menu-list", isVisible && "active")}
      style={style}
    >
      <div className={cx("wrapper")}>
        <input
          id={String(id)}
          name={name}
          type={"text"}
          placeholder={name}
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>
      <div className={cx("choices-wrapper")}>
        {updatedChoices &&
          updatedChoices.map((item: any) => {
            const colorization: Colorization[] | undefined = item?.colorization;
            let color: string | undefined = colorization?.find(
              (c: Colorization) => c.pattern && item.label.includes(c.pattern)
            )?.color;

            if (!color) {
              color =
                colorization?.find((c: Colorization) => !c.pattern)?.color ||
                "transparent";
            }
            return (
              <div
                className={cx("options-wrapper")}
                onClick={() => handleClick(item.label)}
              >
                {colorization && (
                  <div
                    className={cx("options-colorization")}
                    style={{
                      backgroundColor: color,
                    }}
                  ></div>
                )}
                <span
                  className={cx(
                    "options-label",
                    selectedItems.some(
                      (selectedItem: any) => selectedItem.label === item.label
                    ) && "active"
                  )}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
};
