import { FC, useEffect } from "react";
import { useFormContext, useController } from "react-hook-form";
import DatePicker from "src/components/DatePicker/DatePicker";
import { IIFilters } from "src/types";
import { formatDate } from "src/utils";

interface IProps {
  openingDate: Date;
  fieldName: string;
  item: IIFilters;
  updateFilters: (value1: number, value2: string) => void;
}

export const DateInput: FC<IProps> = ({
  openingDate,
  fieldName,
  item,
  updateFilters,
}) => {
  const { control, setValue } = useFormContext();
  const { field: OpeningDate } = useController({
    name: fieldName,
    control,
  });

  useEffect(() => {
    const currentDate = new Date(openingDate);
    currentDate.setDate(currentDate.getDate());
  }, [fieldName, item.id, openingDate, setValue]);

  return (
    <div>
      <DatePicker
        onChange={(dates: Date | [Date | null, Date | null] | null) => {
          const newStartDate = dates as [Date | null, Date | null];
          OpeningDate.onChange(newStartDate);
          Array.isArray(newStartDate)
            ? updateFilters(item.id, formatDate(String(newStartDate)))
            : updateFilters(item.id, formatDate(newStartDate));
        }}
        id={fieldName}
        startDate={OpeningDate.value}
      />
    </div>
  );
};
