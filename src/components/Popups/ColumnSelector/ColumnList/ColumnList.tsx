import { FC, useEffect, useState } from "react";
import classnames from "classnames/bind";
import styles from "./ColumnList.module.scss";
import SlideCheckbox from "src/components/SlideCheckbox";
import { ReactComponent as CheckboxIcon } from "src/assets/icons/checkbox-icon.svg";
import { useFormContext } from "react-hook-form";
import { useGetFiltersDescribeDataQuery } from "src/store/services/filtersApi";
import { ColumnData, EDataKeys, IIFilters } from "src/types";

const cx: CX = classnames.bind(styles);

interface IProps {
  searchValue: string;
}
export const ColumnList: FC<IProps> = ({ searchValue }) => {
  const { setValue, watch } = useFormContext();
  const { data: describeData } = useGetFiltersDescribeDataQuery(
    watch(EDataKeys.DATA_SOURCE)
  );
  const hasData = watch(EDataKeys.FILTERS);
  const initialFilters = !hasData
    ? describeData?.columns.map((item: ColumnData) => ({
        checked1: false,
        checked2: false,
        disabled: false,
        ...item,
      }))
    : watch(EDataKeys.FILTERS);
  const [filters, setFilters] = useState<IIFilters[]>(initialFilters);
  const [filteredList, setFilteredList] = useState<IIFilters[]>(filters);
  const handleCheckboxChange = (
    checkboxNumber: number,
    checked: boolean,
    name: string
  ) => {
    const newElements = [...filters];
    newElements.forEach((item: IIFilters) => {
      if (item.name === name) {
        if (checkboxNumber === 1) {
          item.checked1 = checked;
        } else {
          item.checked2 = checked;
        }
        setFilters(newElements);
        setValue(EDataKeys.FILTERS, newElements);
      }
    });

    const newFilteredElements = [...filteredList];
    newFilteredElements.forEach((item: IIFilters) => {
      if (item.name === name) {
        if (checkboxNumber === 1) {
          item.checked1 = checked;
        } else {
          item.checked2 = checked;
        }
        setFilteredList(newFilteredElements);
      }
    });
  };

  useEffect(() => {
    let updatedList = [...filters];
    updatedList = filters.filter((item: IIFilters) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredList(updatedList);
  }, [filters, searchValue]);

  return (
    <div className={cx("list-item-wrapper")}>
      {filteredList.map(
        ({ name, checked1, checked2 }: IIFilters, index: number) => (
          <div key={name} className={cx("list-item")}>
            <div className={cx("filter-item")}>
              <label htmlFor={name}>
                <input
                  id={name}
                  type="checkbox"
                  checked={checked1}
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
              checked={checked2}
              index={index}
              checkboxNumber={2}
              onChange={(checked, checkboxNumber) =>
                handleCheckboxChange(checkboxNumber, checked, name)
              }
            />
          </div>
        )
      )}
    </div>
  );
};
