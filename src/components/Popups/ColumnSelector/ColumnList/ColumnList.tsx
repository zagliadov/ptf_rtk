import { FC } from "react";
import classnames from "classnames/bind";
import styles from "./ColumnList.module.scss";
import SlideCheckbox from "src/components/SlideCheckbox";
import { ReactComponent as CheckboxIcon } from "src/assets/icons/checkbox-icon.svg";
import { useFormContext } from "react-hook-form";
import { EDataKeys, IIFilters } from "src/types";
import { useSearch } from "src/hook/useSearch";
import * as _ from "lodash";
import { isNameExcluded } from "src/utils/helpers";
import { RootState, useAppSelector } from "src/store/store";

const cx: CX = classnames.bind(styles);

interface IProps {
  searchValue: string;
  filters: IIFilters[];
  setFilters: Function;
}
const ColumnList: FC<IProps> = ({ searchValue, filters, setFilters }) => {
  const { setValue } = useFormContext();
  const { filteredList, setFilteredList } = useSearch(filters, searchValue);
  const { reportSourceId } = useAppSelector((state: RootState) => state.report);

  /**
   * Modifies an array of filters based on a specific checkbox change.
   *
   * @param {IIFilters[]} array - The array of filter objects to be modified.
   * @param {string} name - The name of the filter item whose checkbox state is being changed.
   * @param {number} checkboxNumber - Indicates which checkbox (1 or 2) is being changed.
   * @param {boolean} checked - The new checked state of the checkbox.
   * @returns {IIFilters[]} - A new array of filters with the updated checkbox state.
   *
   * @description
   * This function iterates over an array of filter objects. When it finds the filter item
   * with the matching name, it updates its `selectedTableCell` or `selectedTableFilter` state based on `checkboxNumber`.
   * If `checkboxNumber` is 1 and `checked` is false, `selectedTableFilter` is also set to false.
   */
  const CheckboxChange = (
    array: IIFilters[],
    name: string,
    checkboxNumber: number,
    checked: boolean
  ) => {
    return _.map(array, (item) => {
      if (item[EDataKeys.NAME] === name) {
        const newChecked2 =
          checkboxNumber === 1 && !checked
            ? false
            : item[EDataKeys.SELECTED_TABLE_FILTER];
        return {
          ...item,
          ...(checkboxNumber === 1
            ? {
                [EDataKeys.SELECTED_TABLE_CELL]: checked,
                selectedTableFilter: newChecked2,
              }
            : { [EDataKeys.SELECTED_TABLE_FILTER]: checked }),
        };
      }
      return item;
    });
  };

  /**
   * Handles changes to either of the two checkboxes in a filter item.
   *
   * @param {number} checkboxNumber - The number of the checkbox being changed (1 or 2).
   * @param {boolean} checked - The new checked state of the checkbox.
   * @param {string} name - The name of the filter item whose checkbox state is being changed.
   *
   * @description
   * This function is triggered when there's a change in either of the two checkboxes for any filter item.
   * It updates the states of `filters` and `filteredList` to reflect the new checkbox states.
   * It uses the `CheckboxChange` function to create new arrays with updated checkbox states and then
   * sets these new arrays to the `filters` and `filteredList` states. Additionally, it updates
   * the `FILTERS` field in the form context using `setValue` from `react-hook-form`.
   */
  const handleCheckboxChange = (
    checkboxNumber: number,
    checked: boolean,
    name: string
  ) => {
    const newElements: IIFilters[] = CheckboxChange(
      filters,
      name,
      checkboxNumber,
      checked
    );
    setFilters(newElements);
    const newFilteredElements = CheckboxChange(
      filteredList,
      name,
      checkboxNumber,
      checked
    );
    setFilteredList(newFilteredElements);
    setValue(EDataKeys.FILTERS, newElements);
  };

  return (
    <div className={cx("list-item-wrapper")}>
      {!_.isEmpty(filteredList) &&
        _.map(
          filteredList,
          (
            {
              name,
              selectedTableCell,
              selectedTableFilter,
              disabled,
            }: IIFilters,
            index: number
          ) => {
            if(isNameExcluded(name, reportSourceId)) return;
            return (
              <div key={`${name}-checked`} className={cx("list-item")}>
                <div className={cx("filter-item")}>
                  <label htmlFor={`${name}-checked`}>
                    <input
                      id={`${name}-checked`}
                      type="checkbox"
                      checked={selectedTableCell}
                      onChange={(e) =>
                        handleCheckboxChange(1, e.target.checked, name)
                      }
                    />
                    <div className={cx("checkbox-wrapper")}>
                      <div className={cx("checkbox-icon")}>
                        <CheckboxIcon />
                      </div>
                    </div>
                    <span>{name}</span>
                  </label>
                </div>

                <SlideCheckbox
                  checked={selectedTableFilter}
                  index={index}
                  disabled={disabled}
                  checkboxNumber={2}
                  onChange={(selectedTableFilter) =>
                    handleCheckboxChange(2, selectedTableFilter, name)
                  }
                />
              </div>
            );
          }
        )}
    </div>
  );
};

export default ColumnList;
