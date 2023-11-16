import { FC } from "react";
import styles from "./FilteredColumns.module.scss";
import classnames from "classnames/bind";
import { Controller, useFormContext } from "react-hook-form";
import Select from "src/components/Select";
import Input from "src/components/Input";
import { updateChoices } from "src/utils";
import { Choice, EDataKeys, IIFilters, UpdatedChoice } from "src/types";
import { ColumnHeader } from "./ColumnHeader/ColumnHeader";

const cx: CX = classnames.bind(styles);

export const FilteredColumns: FC = () => {
  const { watch, register, control } = useFormContext();
  const filters: IIFilters[] = watch(EDataKeys.FILTERS);
  const selectedFilters = filters && filters.filter((item: IIFilters) => item.checked1);
  return (
    <>
      {selectedFilters && selectedFilters.map((item) => {
        const fieldName: string = `${item.name}`;
        const updatedChoices = updateChoices(item?.choices as Choice[]);
        return (
          <div key={item.name} className={cx("filters-item")}>
            <ColumnHeader item={item} />
            {item.choices && item.type === EDataKeys.TYPE_TEXT && (
              <Controller
                name={fieldName}
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={updatedChoices as UpdatedChoice[]}
                    onChange={(value) => field.onChange(value)}
                    placeholder={item.name}
                  />
                )}
              />
            )}
            {!item.choices && item.type === EDataKeys.TYPE_TEXT && (
              <Input
                {...register(fieldName)}
                name={fieldName}
                placeholder={item.name}
              />
            )}
            {item.type === EDataKeys.TYPE_NUMERIC && (
              <Input
                {...register(fieldName)}
                name={fieldName}
                placeholder={item.name}
                type="number"
              />
            )}
            {item.type === EDataKeys.TYPE_URL && (
              <Input
                {...register(fieldName)}
                name={fieldName}
                placeholder={item.name}
                type="url"
                pattern="https://.*"
              />
            )}
            {item.type === EDataKeys.TYPE_HTML && (
              <Input
                {...register(fieldName)}
                name={fieldName}
                placeholder={item.name}
                type="file"
              />
            )}
          </div>
        );
      })}
    </>
  );
};
