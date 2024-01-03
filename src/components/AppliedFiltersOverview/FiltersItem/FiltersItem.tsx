import { FC, useCallback } from "react";
import styles from "./FiltersItem.module.scss";
import classnames from "classnames/bind";
import * as _ from "lodash";
import { motion } from "framer-motion";
import { Choice, EDataKeys, UpdatedChoice } from "src/types";
import { updateChoices } from "src/utils";
import { DateInput } from "src/components/Popups/Filters/FilteredColumns/components/DateInput/DateInput";
import { DualInput } from "src/components/DualInput/DualInput";
import { USelect } from "src/components/USelect/USelect";
import { MUSelect } from "../../MUSelect/MUSelect";

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
    (value: string | null, name?: string) => {
      if (name && value !== null) {
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
          if (isCheckbox) return false
          if (isUser) console.log(filter, "filter")
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
                <USelect
                  filter={filter}
                  updatedChoices={updatedChoices}
                  handleSelectChange={handleSelectChange}
                />
              )}
              {selectWithOutColorization && (
                <USelect
                  filter={filter}
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
                // <UInput
                //   item={filter}
                //   type={"text"}
                //   handleSelectChange={handleSelectChange}
                // />
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
                // <UInput
                //   item={filter}
                //   type={"text"}
                //   handleSelectChange={handleSelectChange}
                // />
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
                // <UInput
                //   item={filter}
                //   type={"email"}
                //   handleSelectChange={handleSelectChange}
                // />
              )}
              {(isDate || isTimestamp) && (
                <DateInput
                  updateFilters={updateFilters}
                  handleSelectChange={handleSelectChange}
                  fieldName={filter.name}
                  // openingDate={
                  //   filter?.choice ? JSON.parse(filter?.choice) : filter?.choice
                  // }
                  item={filter}
                />
              )}
              {isPhone && (
                <MUSelect
                  item={filter}
                  handleSelectChange={handleSelectChange}
                />
                // <UInput
                //   item={filter}
                //   type={"tel"}
                //   handleSelectChange={handleSelectChange}
                // />
              )}
              {isURL && (
                <MUSelect
                  item={filter}
                  handleSelectChange={handleSelectChange}
                />
                // <UInput
                //   item={filter}
                //   type={"url"}
                //   handleSelectChange={handleSelectChange}
                // />
              )}
            </motion.div>
          );
        })}
    </>
  );
};
