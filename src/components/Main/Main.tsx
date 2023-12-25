import { FC, useRef, useState, useMemo } from "react";
import styles from "./Main.module.scss";
import classnames from "classnames/bind";
import { SideMenu } from "../SideMenu/SideMenu";
import { AppliedFiltersOverview } from "../AppliedFiltersOverview/AppliedFiltersOverview";
import useSideMenuReports from "src/hook/useSideMenuReports";
import useReportData from "src/hook/useReportData";
import DataTable from "../DataTable";
import { TableRef } from "../DataTable/DataTable";
import { parse, isWithinInterval } from "date-fns";

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

  const isDateArray = (value: any) => {
    if (!Array.isArray(value) || value.length !== 2) {
      return false;
    }
    return value.every(
      (dateStr) =>
        parse(dateStr, "dd MMM yyyy", new Date()).toString() !== "Invalid Date"
    );
  };

  const filteredRows = useMemo(() => {
    return rows.filter((row: any) => {
      const matchesFilters = Object.entries(filters).every(
        ([columnName, filterValue]: any) => {
          if (isDateArray(filterValue)) {
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
  }, [rows, filters, searchValue]);

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
