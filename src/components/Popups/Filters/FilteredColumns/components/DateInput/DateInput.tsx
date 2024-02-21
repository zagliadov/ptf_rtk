import { FC, useEffect, useState } from "react";
import DatePicker from "src/components/DatePicker/DatePicker";
import { setFilterChoice } from "src/store/filtersSlice";
import { confirmFilterChanges } from "src/store/managerSlice";
import { RootState, useAppDispatch, useAppSelector } from "src/store/store";
import { IIFilters } from "src/types";
import { formatDate } from "src/utils";

interface IProps {
  openingDate?: Date;
  fieldName: string;
  item: IIFilters;
  updateFilters: (value1: number, value2: any) => void;
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
  const { reportName } = useAppSelector((state: RootState) => state.report);
  const { isEditFiltersOpen, isFiltersOpen } = useAppSelector(
    (state: RootState) => state.manager
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    setSDate(null);
    setEDate(null);
  }, [reportName]);

  useEffect(() => {
    if (item.choice) {
      try {
        const dates = JSON.parse(item.choice);
        console.log(dates, "dates");
        if (Array.isArray(dates) && dates.length === 2) {
          setSDate(new Date(dates[0]));
          setEDate(new Date(dates[1]));
        }
      } catch (error) {
        console.error("Error parsing dates from choice:", error);
      }
    }
  }, [item.choice]);

  const handleDateChange = (
    dates: Date | [Date | null, Date | null] | null
  ) => {
    if (Array.isArray(dates)) {
      setEDate(dates[1]);
      setSDate(dates[0]);
      const [startDate, endDate] = dates;
      if (startDate && endDate && (!isEditFiltersOpen || !isFiltersOpen)) {
        updateFilters &&
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
        dispatch(confirmFilterChanges(true));
        dispatch(
          setFilterChoice({
            choice: [
              formatDate(startDate.toISOString()),
              formatDate(endDate.toISOString()),
            ],
            filterName: fieldName,
            reportName,
          })
        );
      }
      if (!endDate && !startDate && (!isEditFiltersOpen || !isFiltersOpen)) {
        updateFilters && updateFilters(item.id, "");
        handleSelectChange && handleSelectChange("", item.name);
        dispatch(confirmFilterChanges(true));
        dispatch(
          setFilterChoice({
            choice: [],
            filterName: fieldName,
            reportName,
          })
        );
      }
      if (endDate && startDate && (isEditFiltersOpen || isFiltersOpen)) {
        updateFilters &&
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
      if (!endDate && !startDate && (isEditFiltersOpen || isFiltersOpen)) {
        updateFilters && updateFilters(item.id, "");
        handleSelectChange && handleSelectChange("", item.name);
        dispatch(
          setFilterChoice({
            choice: [],
            filterName: fieldName,
            reportName,
          })
        );
      }
    } else if (dates) {
      updateFilters &&
        updateFilters(item.id, [
          formatDate(dates.toISOString()),
          formatDate(dates.toISOString()),
        ]);
    }
  };

  // const handleDateChange = (
  //   dates: Date | [Date | null, Date | null] | null
  // ) => {
  //   if (Array.isArray(dates)) {
  //     setEDate(dates[1]);
  //     setSDate(dates[0]);
  //     const [startDate, endDate] = dates;
  //     if (startDate && endDate) {
  //       updateFilters &&
  //         updateFilters(item.id, [
  //           formatDate(startDate.toISOString()),
  //           formatDate(endDate.toISOString()),
  //         ]);
  //       handleSelectChange &&
  //         handleSelectChange(
  //           [
  //             formatDate(startDate.toISOString()),
  //             formatDate(endDate.toISOString()),
  //           ],
  //           item.name
  //         );
  //       if (!isEditFiltersOpen) {
  //         dispatch(confirmFilterChanges(true));
  //         dispatch(
  //           setFilterChoice({
  //             choice: [
  //               formatDate(startDate.toISOString()),
  //               formatDate(endDate.toISOString()),
  //             ],
  //             filterName: fieldName,
  //             reportName,
  //           })
  //         );
  //       }
  //     } else {
  //       updateFilters && updateFilters(item.id, "");
  //       handleSelectChange && handleSelectChange("", item.name);
  //     }
  //     if (!endDate && !startDate) {
  //       if (!isEditFiltersOpen) {
  //         dispatch(confirmFilterChanges(true));
  //         dispatch(
  //           setFilterChoice({
  //             choice: [],
  //             filterName: fieldName,
  //             reportName,
  //           })
  //         );
  //       }
  //     }
  //   } else if (dates) {
  //     updateFilters &&
  //       updateFilters(item.id, [
  //         formatDate(dates.toISOString()),
  //         formatDate(dates.toISOString()),
  //       ]);
  //   }
  // };

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
