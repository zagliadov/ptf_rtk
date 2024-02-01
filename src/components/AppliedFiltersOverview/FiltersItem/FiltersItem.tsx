import { FC, useCallback, useMemo } from "react";
import styles from "./FiltersItem.module.scss";
import classnames from "classnames/bind";
import * as _ from "lodash";
import { motion } from "framer-motion";
import { EDataKeys } from "src/types";
import { DateInput } from "src/components/Popups/Filters/FilteredColumns/components/DateInput/DateInput";
import { DualInput } from "src/components/DualInput/DualInput";
import { MUSelect } from "../../MUSelect/MUSelect";
import { RootState, useAppSelector } from "src/store/store";

const cx: CX = classnames.bind(styles);

interface IProps {
  selectedFilters: any[];
  visibleBlocks: number;
  onFilterChange: any;
  filtersValue: any;
}
export const FiltersItem: FC<IProps> = ({
  selectedFilters,
  visibleBlocks,
  onFilterChange,
  filtersValue,
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

  const { reportName } = useAppSelector((state: RootState) => state.report);

  const memoizedFiltersData = useMemo(() => {
    return selectedFilters.reduce((acc, filter) => {
      const filterValues = _.has(filtersValue, filter.name)
        ? filtersValue[filter.name]
        : [];

      const extractData = _.chain(filterValues)
        .uniq()
        .map((item) => {
          const nameOnly = typeof item === 'string' ? item.replace(/<.*?>/, "").trim() : "";
          return nameOnly;
        })
        .reduce((acc, item) => {
          acc[item] = false;
          return acc;
        }, {})
        .value();

      acc[filter.name] = {
        filterValues,
        extractData,
      };
      return acc;
    }, {});
  }, [selectedFilters, filtersValue]);

  const updateFilters = () => {};
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
          const isColorization = filter[EDataKeys.COLORIZATION];
          const isNumeric = filter[EDataKeys.TYPE] === EDataKeys.TYPE_NUMERIC;
          const isEmail = filter[EDataKeys.TYPE] === EDataKeys.TYPE_EMAIL;
          const isChoices = filter[EDataKeys.CHOICES];
          const isDate = filter[EDataKeys.TYPE] === EDataKeys.TYPE_DATE;
          const isTimestamp =
            filter[EDataKeys.TYPE] === EDataKeys.TYPE_TIMESTAMP;
          const isText = filter[EDataKeys.TYPE] === EDataKeys.TYPE_TEXT;
          const isURL = filter[EDataKeys.TYPE] === EDataKeys.TYPE_URL;
          const isPhone = filter[EDataKeys.TYPE] === EDataKeys.TYPE_PHONE;
          const selectWithColorization = isChoices && isColorization;
          const selectWithOutColorization = isChoices && !isColorization;
          const isUser = filter[EDataKeys.TYPE] === EDataKeys.TYPE_USER;
          const isAutonumber =
            filter[EDataKeys.TYPE] === EDataKeys.TYPE_AUTONUMBER;
          const isCheckbox = filter[EDataKeys.TYPE] === EDataKeys.TYPE_CHECKBOX;
          if (isCheckbox) return false;
          if (!filter.pinToMainView) return false;

          const { extractData } = memoizedFiltersData[filter.name];
          let extractDataFunction;
          if (
            filter[EDataKeys.TYPE] === EDataKeys.TYPE_TEXT ||
            filter[EDataKeys.TYPE] === EDataKeys.TYPE_EMAIL ||
            filter[EDataKeys.TYPE] === EDataKeys.TYPE_USER ||
            filter[EDataKeys.TYPE] === EDataKeys.TYPE_PHONE
          ) {
            extractDataFunction = extractData;
          } else {
            extractDataFunction = {};
          }

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
                <MUSelect
                  item={filter}
                  handleSelectChange={handleSelectChange}
                  extractData={extractDataFunction}
                  isAppliedFiltersOverview={true}
                />
              )}
              {selectWithOutColorization && (
                <MUSelect
                  item={filter}
                  handleSelectChange={handleSelectChange}
                  extractData={extractDataFunction}
                  isAppliedFiltersOverview={true}
                />
              )}
              {(isAutonumber || isNumeric) && (
                <DualInput
                  updateFilters={updateFilters}
                  handleSelectChange={handleSelectChange}
                  item={filter}
                  isAppliedFiltersOverview={true}
                />
              )}
              {(isEmail ||
                isUser ||
                (isText && !isChoices) ||
                (isURL && !isChoices) ||
                (isPhone && !isChoices)) && (
                <MUSelect
                  item={filter}
                  handleSelectChange={handleSelectChange}
                  extractData={extractDataFunction}
                  isAppliedFiltersOverview={true}
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
            </motion.div>
          );
        })}
    </>
  );
};
