import { FC, useCallback, useEffect } from "react";
import styles from "./FiltersItem.module.scss";
import classnames from "classnames/bind";
import { ColumnHeader } from "../ColumnHeader/ColumnHeader";
import { DateInput } from "../components/DateInput/DateInput";
import {
  Choice,
  DynamicFormData,
  EDataKeys,
  IIFilters,
  UpdatedChoice,
} from "src/types";
import { updateChoices } from "src/utils";
import { Controller, useFormContext } from "react-hook-form";
import Select from "src/components/Select";
import * as _ from "lodash";
import { DualInput } from "src/components/DualInput/DualInput";
import { UInput } from "src/components/UInput/UInput";

const cx: CX = classnames.bind(styles);

interface IProps {
  filteredList: IIFilters[];
  setSaveFilteredList?: any;
}
const FiltersItem: FC<IProps> = ({ filteredList, setSaveFilteredList }) => {
  const { control, setValue } = useFormContext<DynamicFormData>();

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
      const updatedFilteredList = filteredList.map(filter => {
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

  // const updateFilters = useCallback(
  //   (id: number, value: any): void => {
  //     const filter: IIFilters | undefined = _.find(filteredList, { id: id });
  //     console.log(filter, "updateFilters FiltersItem")
  //     if (filter) {
  //       filter[EDataKeys.CHOICE] = JSON.stringify(value);
  //       setValue(EDataKeys.FILTERED_LIST, filteredList);
  //       setSaveFilteredList(filteredList);
  //     }
  //   },
  //   [filteredList, setValue]
  // );

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
          if (item[EDataKeys.SELECTED_TABLE_CELL] === true && item[EDataKeys.SELECTED_TABLE_FILTER] === false) return;
          const fieldName: string = `${item?.name}`;
          const updatedChoices: UpdatedChoice[] | null = updateChoices(
            item?.choices as Choice[],
            item?.colorization
          );
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
          const inputText = isText && !isChoices;
          return (
            <div key={item?.id} className={cx("filters-item")}>
              <ColumnHeader item={item} filteredList={filteredList} />
              {selectWithOutColorization && (
                <Controller
                  name={fieldName}
                  control={control}
                  render={({ field }) => (
                    <Select
                      key={Date.now()}
                      {...field}
                      options={updatedChoices as UpdatedChoice[]}
                      onChange={(value) => {
                        field.onChange(value);
                        updateFilters(item?.id, value);
                      }}
                      placeholder={item?.name}
                      value={item?.choice ? JSON.parse(item?.choice) : null}
                    />
                  )}
                />
              )}
              {selectWithColorization && (
                <Controller
                  name={fieldName}
                  control={control}
                  render={({ field }) => (
                    <Select
                      key={Date.now()}
                      {...field}
                      options={updatedChoices as UpdatedChoice[]}
                      onChange={(value) => {
                        field.onChange(value);
                        updateFilters(item?.id, value);
                      }}
                      placeholder={item?.name}
                      value={item?.choice ? JSON.parse(item?.choice) : null}
                    />
                  )}
                />
              )}
              {inputText && (
                <UInput
                  item={item}
                  type={"text"}
                  updateFilters={updateFilters}
                />
              )}
              {isNumeric && (
                <DualInput updateFilters={updateFilters} item={item} />
              )}
              {isURL && (
                <UInput
                  item={item}
                  type={"url"}
                  updateFilters={updateFilters}
                />
              )}
              {isPhone && (
                <UInput
                  item={item}
                  type={"tel"}
                  updateFilters={updateFilters}
                />
              )}
              {isEmail && (
                <UInput
                  item={item}
                  type={"email"}
                  updateFilters={updateFilters}
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
