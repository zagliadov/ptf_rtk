import { FC, useState, useMemo, RefObject, useEffect } from "react";
import styles from "./Main.module.scss";
import classnames from "classnames/bind";
import { SideMenu } from "../SideMenu/SideMenu";
import { AppliedFiltersOverview } from "../AppliedFiltersOverview/AppliedFiltersOverview";
import useReportData from "src/hook/useReportData";
import DataTable from "../DataTable";
import { TableRef } from "../DataTable/DataTable";
import { parse } from "date-fns";
import { RootState, useAppDispatch, useAppSelector } from "src/store/store";
import { SourceReports } from "src/hook/useSideMenuReports";
import { IIFilters } from "src/types";
import { DotSpinner } from "../DotSpinner/DotSpinner";
import { motion } from "framer-motion";
import * as _ from "lodash";
import { selectUserDataByEmail } from "src/store/authSlice";
import { getReportColumn } from "src/store/columnSlice";
import { useGetReportQuery } from "src/store/services/customReportApi";

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
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState<Filter>({});
  const userData = useAppSelector((state: RootState) => selectUserDataByEmail(state));
  const { fullName, role: department } = userData || {};
  const { columns: columnArray } = useAppSelector(
    (state: RootState) => state.column
  );
  const { reportName, reportSourceId, isColumnCreated, reportId } =
    useAppSelector((state: RootState) => state.report);
  const { data } = useGetReportQuery(Number(reportId));
  const variants = {
    hidden: { opacity: 0, y: 1000 },
    visible: { opacity: 1, y: 0 },
  };

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

  const filtersValue = mapColumnNamesToRowValues(columns, rows);

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
      if (filter) {
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
    return (
      rows &&
      rows.filter((row: Record<string, any>) => {
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
              // Assume that row[columnName] can contain a string in the format "Name <Email>"
              const rowValue = row[columnName];
              if (typeof rowValue === "string") {
                // Extract the name from the string if it contains the format "Name <Email>"
                // const namePart = rowValue.split('<')[0].trim();

                // Check if the filterValue array contains the name extracted from the string
                return filterValue.some((filterVal: any) =>
                  rowValue.toLowerCase().includes(filterVal.toLowerCase())
                );
              }
              return false;
            }
            if (!filterValue) {
              return row;
            }
            return row[columnName]?.toString().includes(filterValue);
          }
        );
        const matchesSearch = Object.values(row).some(
          (value: any) =>
            value?.toString().toLowerCase().includes(searchValue.toLowerCase())
        );

        return matchesFilters && matchesSearch;
      })
    );
  }, [rows, processedFilters, searchValue]);

  // Convert filters to an array for ease of processing
  const filtersArray = Object.entries(filters).map(([name, choice]) => ({
    name,
    choice: choice ? JSON.stringify(choice) : "[]",
  }));

  // Create a copy of finalFilterArray for updating
  const updatedFinalFilterArray = finalFilterArray.map((filterItem: any) => {
    const filterUpdate = filtersArray.find(
      (filter) => filter.name === filterItem.name
    );
    if (filterUpdate) {
      // Return a new object with updated choice
      return { ...filterItem, choice: filterUpdate.choice };
    }
    // Return an unchanged object if no update is required
    return filterItem;
  });

  const filteredAndTransformedData = _.reduce(
    updatedFinalFilterArray,
    (acc, item) => {
      if (item.choice && item.choice !== "[]") {
        try {
          const parsedChoice = JSON.parse(item.choice);
          if (!_.isEmpty(parsedChoice)) {
            acc[item.name] = parsedChoice;
          }
        } catch (e) {
          console.error(item.name, ":", e);
        }
      }
      return acc;
    },
    {}
  );

  useEffect(() => {
    dispatch(getReportColumn(Number(reportId)));
  }, []);

  return (
    <main className={cx("main")}>
      <div>
        <SideMenu reportsArray={reportsArray} />
      </div>
      <div className={cx("test")}>
        {!isColumnCreated && rows.length ? (
          <AppliedFiltersOverview
            filterArray={finalFilterArray}
            onFilterChange={handleFilterChange}
            setSearchValue={setSearchValue}
            searchValue={searchValue}
            filtersValue={filtersValue}
          />
        ) : (
          <div className={cx("overview-skeleton")}></div>
        )}
        {!isColumnCreated ? (
          !!(rows.length && columns.length) ? (
            <motion.div
              initial="hidden"
              animate="visible"
              transition={{ duration: 1 }}
              variants={variants}
            >
              <div className={cx("data-table-wrapper")}>
                <DataTable
                  rows={filteredRows}
                  columnDefs={columns as any}
                  onRowClick={() => {}}
                  onRecordsNumberChanged={() => {}}
                  excelName="Report"
                  pdfName="Report"
                  ref={dataTableRef as any}
                  reportName={reportName}
                  filters={filteredAndTransformedData}
                  fullName={fullName && fullName}
                  department={department}
                  columnArray={columnArray}
                  dateCreated={data && data[0] && data[0]["Date Created"] ? data[0]["Date Created"] : undefined}
                  dateModified={data && data[0] && data[0]["Date Modified"] ? data[0]["Date Modified"] : undefined}
                />
              </div>
            </motion.div>
          ) : !reportName || !reportSourceId ? (
            <div className={cx("data-table-is-loading")}>
              <span>Please select a report</span>
            </div>
          ) : (
            <div className={cx("data-table-is-loading")}>
              <DotSpinner />
            </div>
          )
        ) : (
          <div className={cx("data-table-is-loading")}>
            <DotSpinner />
          </div>
        )}
      </div>
    </main>
  );
};
