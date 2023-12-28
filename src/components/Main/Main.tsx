import { FC, useRef, useState, useMemo } from "react";
import styles from "./Main.module.scss";
import classnames from "classnames/bind";
import { SideMenu } from "../SideMenu/SideMenu";
import { AppliedFiltersOverview } from "../AppliedFiltersOverview/AppliedFiltersOverview";
import useSideMenuReports from "src/hook/useSideMenuReports";
import useReportData from "src/hook/useReportData";
import DataTable from "../DataTable";
import { TableRef } from "../DataTable/DataTable";
import { parse } from "date-fns";

const cx: CX = classnames.bind(styles);

export const Main: FC = () => {
  const reportsArray = useSideMenuReports();
  const [searchValue, setSearchValue] = useState<string>("");
  const dataTableRef = useRef<TableRef>(null);
  const { finalFilterArray, rows, columns } = useReportData();
  const [filters, setFilters] = useState({});

  const handleFilterChange = (columnName: any, filterValue: any) => {
    if (columnName && filterValue !== null) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [columnName]: filterValue,
      }));
    }
  };

  const isNumericRange = (value: any) => {
    return (
      Array.isArray(value) &&
      value.length === 2 &&
      value.every((v) => !isNaN(v))
    );
  };

  const isDateArray = (value: string) => {
    if (!Array.isArray(value) || value.length !== 2) {
      return false;
    }
    return value.every(
      (dateStr) =>
        parse(dateStr, "dd MMM yyyy", new Date()).toString() !== "Invalid Date"
    );
  };

  const processFilters = (filterArray: any) => {
    const newFilters = {};
    filterArray.forEach((filter: any) => {
      // Checking if there is already a value for this filter in the current filters
      if (filters.hasOwnProperty(filter.name)) {
        newFilters[filter.name] = filters[filter.name];
      } else if (filter.choice) {
        // If there is no value in the current filters, use the value from choice
        const choiceValue = JSON.parse(filter.choice);
        newFilters[filter.name] = choiceValue;
      }
    });
    return newFilters;
  };

  const processedFilters = processFilters(finalFilterArray);

  const filteredRows = useMemo(() => {
    return rows.filter((row: any) => {
      const matchesFilters = Object.entries(processedFilters).every(
        ([columnName, filterValue]: any) => {
          if (isNumericRange(filterValue)) {
            const [min, max] = filterValue.map(Number);
            const rowValue = Number(row[columnName]);
            return rowValue >= min && rowValue <= max;
          } else if (isDateArray(filterValue)) {
            const startDateTimestamp = Date.parse(filterValue[0]);
            const endDateTimestamp = Date.parse(filterValue[1]);
            const rowDate = row[columnName];
            if (!rowDate) {
              return false;
            }
            const rowDateTimestamp = Date.parse(rowDate);

            return (
              rowDateTimestamp >= startDateTimestamp &&
              rowDateTimestamp <= endDateTimestamp
            );
          }
          return row[columnName]?.toString().includes(filterValue);
        }
      );
      const matchesSearch = Object.values(row).some(
        (value: any) =>
          value?.toString().toLowerCase().includes(searchValue.toLowerCase())
      );

      return matchesFilters && matchesSearch;
    });
  }, [rows, processedFilters, searchValue]);

  return (
    <main className={cx("main")}>
      <div>
        <SideMenu reportsArray={reportsArray} />
      </div>
      <div className={cx("test")}>
        <AppliedFiltersOverview
          filterArray={finalFilterArray}
          onFilterChange={handleFilterChange}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
        />
        {!!(rows.length && columns.length) && (
          <div className={cx("data-table-wrapper")}>
            <DataTable
              rows={filteredRows}
              columnDefs={columns}
              onRowClick={() => {}}
              onRecordsNumberChanged={() => {}}
              excelName="Report"
              ref={dataTableRef as any}
            />
          </div>
        )}
      </div>
    </main>
  );
};
