import { FC, useCallback, useEffect, useMemo } from "react";
import styles from "./FiltersItem.module.scss";
import classnames from "classnames/bind";
import { ColumnHeader } from "../ColumnHeader/ColumnHeader";
import { DateInput } from "../components/DateInput/DateInput";
import { DynamicFormData, EDataKeys, IIFilters } from "src/types";
// import { updateChoicesCheckbox } from "src/utils";
import { useFormContext } from "react-hook-form";
import * as _ from "lodash";
import { DualInput } from "src/components/DualInput/DualInput";
import { MUSelect } from "src/components/MUSelect/MUSelect";
import { isNameExcluded } from "src/utils/helpers";
import { RootState, useAppSelector } from "src/store/store";
import { useGetSourceItemsDataQuery } from "src/store/services/sourceApi";
import { Source, sourceByType } from "src/constants/sources";

const cx: CX = classnames.bind(styles);

interface IProps {
  filteredList: IIFilters[];
  setSaveFilteredList?: any;
}
const FiltersItem: FC<IProps> = ({ filteredList, setSaveFilteredList }) => {
  const { setValue, watch } = useFormContext<DynamicFormData>();
  const dataSource = watch(EDataKeys.DATA_SOURCE);
  const { reportSourceId } = useAppSelector((state: RootState) => state.report);
  const source: Source = sourceByType[dataSource];
  const { data: rowData } = useGetSourceItemsDataQuery(source, {
    skip: !source,
  });

  const mapColumnNamesToRowValues = (columns: any, rows: any) => {
    const result = _.reduce(
      columns,
      (acc, column) => {
        acc[column.name] = [];
        return acc;
      },
      {}
    );

    _.forEach(rows, (row) => {
      _.forEach(row, (value, key) => {
        if (_.has(result, key) && !_.isNull(value)) {
          result[key].push(value);
        }
      });
    });

    return result;
  };

  const filtersValue = mapColumnNamesToRowValues(filteredList, rowData);

  const memoizedFiltersData = useMemo(() => {
    return filteredList.reduce((acc, filter) => {
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
  }, [filteredList, filtersValue]);

  /**
   * Updates the filter value for a specific filter item.
   * This function finds a filter by its ID in the filtered list and updates its value.
   * After updating the specific filter's value, it sets the updated list of filters.
   * @param {number} id - The ID of the filter to be updated.
   * @param {string | null} value - The new value to set for the filter. Can be a string or null.
   * @callback useCallback - React hook that will return a memoized version of the callback function.
   * @param {IIFilters[]} filteredList - The current list of filters.
   * @param {Function} setValue - Function from useFormContext to update the state of the form.
   */
  const updateFilters = useCallback(
    (id: number, value: any): void => {
      const updatedFilteredList = filteredList.map((filter) => {
        if (filter.id === id) {
          return { ...filter, [EDataKeys.CHOICE]: JSON.stringify(value) };
        }
        return filter;
      });

      setValue(EDataKeys.FILTERED_LIST, updatedFilteredList);
      setSaveFilteredList(updatedFilteredList);
    },
    [filteredList, setValue, setSaveFilteredList]
  );

  useEffect(() => {
    const idsArray: string[] = _.map(filteredList, (item) =>
      _.toString(item.id)
    );
    setValue(EDataKeys.COLUMN_IDS, idsArray);
  }, [filteredList, setValue]);
  const sortedFilters = _.sortBy(filteredList, "position");
  return (
    <>
      {!_.isEmpty(sortedFilters) &&
        _.map(sortedFilters, (item: IIFilters) => {
          if (
            item[EDataKeys.SELECTED_TABLE_CELL] === true &&
            item[EDataKeys.SELECTED_TABLE_FILTER] === false
          )
            return;
          const fieldName: string = `${item?.name}`;
          const isNumeric = item[EDataKeys.TYPE] === EDataKeys.TYPE_NUMERIC;
          const isDate = item[EDataKeys.TYPE] === EDataKeys.TYPE_DATE;
          const isTimestamp = item[EDataKeys.TYPE] === EDataKeys.TYPE_TIMESTAMP;
          const isColorization = item[EDataKeys.COLORIZATION];
          const isChoices = item[EDataKeys.CHOICES];
          const selectWithColorization = isChoices && isColorization;
          const selectWithOutColorization = isChoices && !isColorization;
          const isURL = item[EDataKeys.TYPE] === EDataKeys.TYPE_URL;
          const isPhone = item[EDataKeys.TYPE] === EDataKeys.TYPE_PHONE;
          const isEmail = item[EDataKeys.TYPE] === EDataKeys.TYPE_EMAIL;
          const isText = item[EDataKeys.TYPE] === EDataKeys.TYPE_TEXT;
          const isUser = item[EDataKeys.TYPE] === EDataKeys.TYPE_USER;
          const isAutonumber =
            item[EDataKeys.TYPE] === EDataKeys.TYPE_AUTONUMBER;
          const isCheckbox = item[EDataKeys.TYPE] === EDataKeys.TYPE_CHECKBOX;
          if (isCheckbox) return;
          if (isNameExcluded(item.name, reportSourceId)) return;
          const { extractData } = memoizedFiltersData[item.name] || {};

          let extractDataFunction;
          if (
            item[EDataKeys.TYPE] === EDataKeys.TYPE_TEXT ||
            item[EDataKeys.TYPE] === EDataKeys.TYPE_EMAIL ||
            item[EDataKeys.TYPE] === EDataKeys.TYPE_USER ||
            item[EDataKeys.TYPE] === EDataKeys.TYPE_PHONE
          ) {
            extractDataFunction = extractData;
          } else {
            extractDataFunction = {};
          }
          return (
            <div key={item?.id} className={cx("filters-item")}>
              <ColumnHeader item={item} filteredList={filteredList} />
              {selectWithOutColorization && (
                <MUSelect
                  item={item}
                  updateFilters={updateFilters}
                  extractData={extractDataFunction}
                  width={"363px"}
                  right={17}
                />
              )}
              {selectWithColorization && (
                <MUSelect
                  item={item}
                  updateFilters={updateFilters}
                  extractData={extractDataFunction}
                  width={"363px"}
                  right={17}
                />
              )}
              {(isEmail ||
                isUser ||
                (isText && !isChoices) ||
                (isURL && !isChoices) ||
                (isPhone && !isChoices)) && (
                <MUSelect
                  item={item}
                  updateFilters={updateFilters}
                  extractData={extractDataFunction}
                  top={44}
                  right={17}
                  width={"363px"}
                />
              )}
              {(isAutonumber || isNumeric) && (
                <DualInput
                  updateFilters={updateFilters}
                  item={item}
                />
              )}
              {(isDate || isTimestamp) && (
                <DateInput
                  updateFilters={updateFilters}
                  fieldName={fieldName}
                  openingDate={new Date()}
                  item={item}
                />
              )}
            </div>
          );
        })}
    </>
  );
};

export default FiltersItem;
