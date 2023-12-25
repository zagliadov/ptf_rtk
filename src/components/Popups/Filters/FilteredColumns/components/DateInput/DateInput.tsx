import { FC, useEffect, useState } from "react";
import DatePicker from "src/components/DatePicker/DatePicker";
import { IIFilters } from "src/types";
import { formatDate } from "src/utils";

interface IProps {
  openingDate: Date;
  fieldName: string;
  item: IIFilters;
  updateFilters: (value1: number, value2: [string, string]) => void;
  handleSelectChange?: any;
}

export const DateInput: FC<IProps> = ({
  openingDate,
  fieldName,
  item,
  updateFilters,
  handleSelectChange,
}) => {
  const [eDate, setEDate] = useState<Date | null>();
  const [sDate, setSDate] = useState<Date | null>();
  useEffect(() => {
    if (item.choice) {
      try {
        const dates = JSON.parse(item.choice);
        if (Array.isArray(dates) && dates.length === 2) {
          setSDate(new Date(dates[0]));
          setEDate(new Date(dates[1]));
        }
      } catch (error) {
        console.error("Error parsing dates from choice:", error);
      }
    }
  }, [item.choice, openingDate]);

  const handleDateChange = (
    dates: Date | [Date | null, Date | null] | null
  ) => {
    if (Array.isArray(dates)) {
      setEDate(dates[1]);
      setSDate(dates[0]);
      const [startDate, endDate] = dates;
      if (startDate && endDate) {
        updateFilters(item.id, [
          formatDate(startDate.toISOString()),
          formatDate(endDate.toISOString()),
        ]);
        handleSelectChange &&
          handleSelectChange(
            [
              formatDate(startDate.toISOString()),
              formatDate(endDate.toISOString()),
            ],
            item.name
          );
      }
    } else if (dates) {
      updateFilters(item.id, [
        formatDate(dates.toISOString()),
        formatDate(dates.toISOString()),
      ]);
      handleSelectChange &&
        handleSelectChange(
          [formatDate(dates.toISOString()), formatDate(dates.toISOString())],
          item.name
        );
    }
  };

  return (
    <div>
      <DatePicker
        range={true}
        onChange={handleDateChange}
        id={fieldName}
        startDate={sDate}
        endDate={eDate}
      />
    </div>
  );
};

export default DateInput;
