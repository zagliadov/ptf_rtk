import { FC, useState, useMemo, RefObject, useEffect } from "react";
import styles from "./Main.module.scss";
import classnames from "classnames/bind";
import { SideMenu } from "../SideMenu/SideMenu";
import { AppliedFiltersOverview } from "../AppliedFiltersOverview/AppliedFiltersOverview";
import useReportData from "src/hook/useReportData";
import DataTable from "../DataTable";
import { TableRef } from "../DataTable/DataTable";
import { parse } from "date-fns";
import { RootState, useAppSelector } from "src/store/store";
import { SourceReports } from "src/hook/useSideMenuReports";
import { IIFilters } from "src/types";

const cx: CX = classnames.bind(styles);

interface IProps {
  dataTableRef: RefObject<TableRef>;
  reportsArray: SourceReports[];
}

interface Filter {
  [key: string]: string | string[];
}

export const Main: FC<IProps> = ({ dataTableRef, reportsArray }) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const { finalFilterArray, rows, columns } = useReportData();
  const [filters, setFilters] = useState<Filter>({});
  const { reportName } = useAppSelector((state: RootState) => state.report);

  useEffect(() => {
    setFilters({});
  }, [reportName]);

  const handleFilterChange = (
    columnName: string,
    filterValue: string[] | string | null
  ) => {
    if (columnName && filterValue !== null) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [columnName]: filterValue,
      }));
    }
  };

  const isNumericRange = (value: string[]) => {
    if (!Array.isArray(value) || value.length !== 2) {
      return false;
    }
    // Checks that both values are either numbers or empty strings
    return value.every((v) => v === "" || !isNaN(Number(v)));
  };

  const isStringArray = (value: string | string[] | null) => {
    return (
      Array.isArray(value) && value.every((item) => typeof item === "string")
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

  const processFilters = (filterArray: IIFilters[]) => {
    const newFilters = {};
    filterArray.forEach((filter) => {
      if (filter.pinToMainView) {
        // Checking if there is already a value for this filter in the current filters
        if (filters.hasOwnProperty(filter.name)) {
          newFilters[filter.name] = filters[filter.name];
        } else if (filter.choice && filter.choice !== "[]") {
          // If there is no value in the current filters, use the value from choice
          const choiceValue = JSON.parse(filter.choice);
          newFilters[filter.name] = choiceValue;
        }
      }
    });
    return newFilters;
  };

  const processedFilters: Filter = processFilters(finalFilterArray);

  const filteredRows = useMemo(() => {
    return rows.filter((row: Record<string, any>) => {
      const matchesFilters = Object.entries(processedFilters).every(
        ([columnName, filterValue]: any) => {
          if (isNumericRange(filterValue)) {
            const [minStr, maxStr] = filterValue;
            const rowValue = Number(row[columnName]);
            const min = minStr === "" ? -Infinity : Number(minStr);
            const max = maxStr === "" ? Infinity : Number(maxStr);
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
          } else if (isStringArray(filterValue)) {
            return filterValue.includes(row[columnName]);
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
              pdfName="Report"
              ref={dataTableRef as any}
            />
          </div>
        )}
      </div>
    </main>
  );
};
