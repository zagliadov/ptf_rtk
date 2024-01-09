import { FC, useCallback } from "react";
import styles from "./FiltersItem.module.scss";
import classnames from "classnames/bind";
import * as _ from "lodash";
import { motion } from "framer-motion";
import { Choice, EDataKeys, UpdatedChoice } from "src/types";
import { updateChoices } from "src/utils";
import { DateInput } from "src/components/Popups/Filters/FilteredColumns/components/DateInput/DateInput";
import { DualInput } from "src/components/DualInput/DualInput";
import { MUSelect } from "../../MUSelect/MUSelect";
import { MUCSelect } from "src/components/MUCSelect/MUCSelect";

const cx: CX = classnames.bind(styles);

interface IProps {
  selectedFilters: any[];
  visibleBlocks: number;
  onFilterChange: any;
}
export const FiltersItem: FC<IProps> = ({
  selectedFilters,
  visibleBlocks,
  onFilterChange,
}) => {
  const handleSelectChange = useCallback(
    (value: string | null | any, name?: string) => {
      if (name && value !== null && !_.isEmpty(value)) {
        onFilterChange(name, value);
      } else {
        onFilterChange(name, "");
      }
    },
    [onFilterChange]
  );

  const updateFilters = () => {
    console.log("updateFilters");
  };
  const sortedFilters = _.orderBy(
    selectedFilters,
    [(filter) => filter.position === undefined, "position"],
    ["desc", "asc"]
  );
  const visibleNum =
    selectedFilters.length <= 2 ? visibleBlocks - 2 : visibleBlocks;
  return (
    <>
      {!_.isEmpty(sortedFilters) &&
        _.slice(sortedFilters, 0, visibleNum).map((filter, index) => {
          const updatedChoices: UpdatedChoice[] | null = updateChoices(
            filter?.choices as Choice[],
            filter?.colorization
          );
          const isColorization = filter[EDataKeys.COLORIZATION];
          const isText = filter[EDataKeys.TYPE] === EDataKeys.TYPE_TEXT;
          const isNumeric = filter[EDataKeys.TYPE] === EDataKeys.TYPE_NUMERIC;
          const isEmail = filter[EDataKeys.TYPE] === EDataKeys.TYPE_EMAIL;
          const isChoices = filter[EDataKeys.CHOICES];
          const isDate = filter[EDataKeys.TYPE] === EDataKeys.TYPE_DATE;
          const isTimestamp =
            filter[EDataKeys.TYPE] === EDataKeys.TYPE_TIMESTAMP;
          const isURL = filter[EDataKeys.TYPE] === EDataKeys.TYPE_URL;
          const isPhone = filter[EDataKeys.TYPE_PHONE] === EDataKeys.TYPE_PHONE;
          const selectWithColorization = isChoices && isColorization;
          const selectWithOutColorization = isChoices && !isColorization;
          const inputText = isText && !isChoices;
          const isUser = filter[EDataKeys.TYPE] === EDataKeys.TYPE_USER;
          const isAutonumber =
            filter[EDataKeys.TYPE] === EDataKeys.TYPE_AUTONUMBER;
          const isCheckbox = filter[EDataKeys.TYPE] === EDataKeys.TYPE_CHECKBOX;
          if (isCheckbox) return false;
          if (!filter.pinToMainView) return false;
          return (
            <motion.div
              key={`filter-block-${filter.id}`}
              id={`filter-block-${filter.id}`}
              className={cx("filter-block")}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <span className={cx("filter-name")}>{filter.name}</span>
              {selectWithColorization && (
                <MUCSelect
                  item={filter}
                  updatedChoices={updatedChoices}
                  handleSelectChange={handleSelectChange}
                />
              )}
              {selectWithOutColorization && (
                <MUCSelect
                  item={filter}
                  updatedChoices={updatedChoices}
                  handleSelectChange={handleSelectChange}
                />
              )}
              {isAutonumber && (
                <DualInput
                  updateFilters={updateFilters}
                  handleSelectChange={handleSelectChange}
                  item={filter}
                />
              )}
              {isUser && (
                <MUSelect
                  item={filter}
                  handleSelectChange={handleSelectChange}
                />
              )}
              {inputText && (
                <MUSelect
                  item={filter}
                  handleSelectChange={handleSelectChange}
                />
              )}
              {isNumeric && (
                <DualInput
                  updateFilters={updateFilters}
                  handleSelectChange={handleSelectChange}
                  item={filter}
                />
              )}
              {isEmail && (
                <MUSelect
                  item={filter}
                  handleSelectChange={handleSelectChange}
                />
              )}
              {(isDate || isTimestamp) && (
                <DateInput
                  updateFilters={updateFilters}
                  handleSelectChange={handleSelectChange}
                  fieldName={filter.name}
                  item={filter}
                />
              )}
              {isPhone && (
                <MUSelect
                  item={filter}
                  handleSelectChange={handleSelectChange}
                />
              )}
              {isURL && (
                <MUSelect
                  item={filter}
                  handleSelectChange={handleSelectChange}
                />
              )}
            </motion.div>
          );
        })}
    </>
  );
};
