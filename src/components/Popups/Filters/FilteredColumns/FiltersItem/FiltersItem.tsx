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
import Input from "src/components/Input";
import Textarea from "src/components/Textarea/Textarea";
import * as _ from "lodash";

const cx: CX = classnames.bind(styles);

interface IProps {
  filteredList: IIFilters[];
}
const FiltersItem: FC<IProps> = ({ filteredList }) => {
  const { control, setValue, register } = useFormContext<DynamicFormData>();

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
    (id: number, value: string | null): void => {
      const filter: IIFilters | undefined = _.find(filteredList, { id: id });
      if (filter) {
        filter[EDataKeys.CHOICE] = value;
        setValue(EDataKeys.FILTERED_LIST, filteredList);
      }
    },
    [filteredList, setValue]
  );

  useEffect(() => {
    const idsArray: string[] = _.map(filteredList, (item) =>
      _.toString(item.id)
    );
    setValue(EDataKeys.COLUMN_IDS, idsArray);
  }, [filteredList, setValue]);

  return (
    <>
      {filteredList &&
        _.map(filteredList, (item: IIFilters) => {
          const fieldName: string = `${item?.name}`;
          const updatedChoices: UpdatedChoice[] | null = updateChoices(
            item?.choices as Choice[],
            item?.colorization
          );
          return (
            <div key={item?.id} className={cx("filters-item")}>
              <ColumnHeader item={item} filteredList={filteredList} />

              {item?.choices &&
                item?.type === EDataKeys.TYPE_TEXT &&
                !item[EDataKeys.COLORIZATION] && (
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
                      />
                    )}
                  />
                )}
              {item?.choices &&
                item?.type === EDataKeys.TYPE_TEXT &&
                item[EDataKeys.COLORIZATION] && (
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
                      />
                    )}
                  />
                )}
              {!item?.choices && item?.type === EDataKeys.TYPE_TEXT && (
                <Input
                  {...register(fieldName)}
                  onChange={(e) => updateFilters(item?.id, e.target.value)}
                  name={fieldName}
                  placeholder={item?.name}
                  type="text"
                />
              )}
              {fieldName && item.type === EDataKeys.TYPE_NUMERIC && (
                <Input
                  {...register(fieldName)}
                  onChange={(e) => updateFilters(item?.id, e.target.value)}
                  name={fieldName}
                  placeholder={item?.name}
                  type="number"
                />
              )}
              {item?.type === EDataKeys.TYPE_URL && (
                <Input
                  {...register(fieldName)}
                  onChange={(e) => updateFilters(item?.id, e.target.value)}
                  name={fieldName}
                  placeholder={item?.name}
                  type="url"
                  pattern="https://.*"
                />
              )}
              {item?.type === EDataKeys.TYPE_PHONE && (
                <Input
                  {...register(fieldName)}
                  onChange={(e) => updateFilters(item?.id, e.target.value)}
                  name={fieldName}
                  placeholder={item?.name}
                  type="tel"
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                />
              )}
              {item?.type === EDataKeys.TYPE_EMAIL && (
                <Input
                  {...register(fieldName)}
                  onChange={(e) => updateFilters(item?.id, e.target.value)}
                  name={fieldName}
                  placeholder={item?.name}
                  type="email"
                  pattern=".+@gmail\.com"
                />
              )}
              {item?.type === EDataKeys.TYPE_DATE && (
                <DateInput
                  updateFilters={updateFilters}
                  fieldName={fieldName}
                  openingDate={new Date()}
                  item={item}
                />
              )}
              {item?.type === EDataKeys.TYPE_TIMESTAMP && (
                <DateInput
                  updateFilters={updateFilters}
                  fieldName={fieldName}
                  openingDate={new Date()}
                  item={item}
                />
              )}
              {item?.type === EDataKeys.TYPE_MULTILINE && (
                <Textarea
                  {...register(fieldName)}
                  onChange={(e) =>
                    updateFilters(
                      item?.id,
                      (e.target as HTMLTextAreaElement).value
                    )
                  }
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
