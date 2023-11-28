import { FC, useEffect, useMemo, lazy, Suspense } from "react";
import styles from "./FilteredColumns.module.scss";
import classnames from "classnames/bind";
import { useFormContext } from "react-hook-form";
import { DynamicFormData, EDataKeys, IIFilters } from "src/types";
import { useSearch } from "src/hook/useSearch";
import { Reorder } from "framer-motion";
import { DotSpinner } from "src/components/DotSpinner/DotSpinner";
import * as _ from "lodash";
const FiltersItem = lazy(() => import("./FiltersItem/FiltersItem"));

const cx: CX = classnames.bind(styles);

interface IProps {
  searchValue: string;
  saveFilteredList: IIFilters[];
  setSaveFilteredList: (value: IIFilters[]) => void;
}
export const FilteredColumns: FC<IProps> = ({ searchValue, saveFilteredList, setSaveFilteredList }) => {
  const { watch, setValue } = useFormContext<DynamicFormData>();
  const filters: IIFilters[] = watch(EDataKeys.FILTERS);
  const selectedFilters: IIFilters[] = useMemo(
    () => _.filter(filters, (item) => item[EDataKeys.CHECKED1]),
    [filters]
  );

  /**
   * Updates the saved list of filters (`saveFilteredList`) based on the changes in selected filters (`selectedFilters`).
   *
   * The hook performs two primary functions:
   * 1. Adds new filters to `saveFilteredList` that are present in `selectedFilters` but not in `saveFilteredList`.
   *    For these new filters, it sets their `PIN_TO_MAIN_VIEW` property to false.
   * 2. If any filters are removed from `selectedFilters`, it updates `saveFilteredList` by removing those filters as well.
   *    This is done while maintaining the original order of filters in `saveFilteredList`.
   *
   * @effect
   * - Runs whenever there is a change in `selectedFilters` or `saveFilteredList`.
   * - Keeps `saveFilteredList` synchronized with `selectedFilters` in terms of presence and absence of filters,
   *   while preserving the order in `saveFilteredList`.
   */

  useEffect(() => {
    // Adds new filters to saveFilteredList.
    const newFilters: IIFilters[] = _.differenceBy(selectedFilters, saveFilteredList, "id");
    _.forEach(newFilters, (item) => (item[EDataKeys.PIN_TO_MAIN_VIEW] = false));
    if (newFilters.length > 0) {
      setSaveFilteredList(_.union(saveFilteredList, newFilters));
    }

    // Removes filters from saveFilteredList that are not found in selectedFilters.
    if (selectedFilters.length < saveFilteredList.length) {
      const updatedFilters: IIFilters[] = _.intersectionBy(
        saveFilteredList,
        selectedFilters,
        "id"
      );
      console.log(selectedFilters, "selectedFilters");
      setSaveFilteredList(updatedFilters);
    }
  }, [selectedFilters, saveFilteredList, setSaveFilteredList]);

  const { filteredList, setFilteredList } = useSearch(
    saveFilteredList,
    searchValue
  );

  useEffect(() => {
    setValue(EDataKeys.FILTERED_LIST, saveFilteredList);
  }, [filteredList, saveFilteredList, setValue, setFilteredList]);

  return (
    <>
      <Reorder.Group
        className={cx("reorder")}
        values={saveFilteredList}
        onReorder={setSaveFilteredList}
      >
        <Suspense
          fallback={
            <div className={cx("is-loading")}>
              <DotSpinner />
            </div>
          }
        >
          <FiltersItem filteredList={filteredList} />
        </Suspense>
      </Reorder.Group>
    </>
  );
};
