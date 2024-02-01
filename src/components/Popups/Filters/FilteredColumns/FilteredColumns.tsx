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
  isEdit?: boolean;
}
export const FilteredColumns: FC<IProps> = ({
  searchValue,
  saveFilteredList,
  setSaveFilteredList,
  isEdit = false,
}) => {
  const { watch, setValue } = useFormContext<DynamicFormData>();
  const filters: IIFilters[] = watch(EDataKeys.FILTERS);

  const selectedFilters: IIFilters[] = useMemo(
    () =>
      _.filter(
        filters,
        (item) =>
          item[EDataKeys.SELECTED_TABLE_FILTER] ||
          item[EDataKeys.SELECTED_TABLE_CELL]
      ),
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

  /**
   * Computes a new list of saved filters by merging selected filters with existing saved filters.
   * @description
   * This hook combines the `selectedFilters` with the `saveFilteredList`, updating the existing saved filters with any new selections,
   * and adding new filters that are selected but not yet saved. It ensures that each filter's `SELECTED_TABLE_FILTER` and
   * `SELECTED_TABLE_CELL` properties are updated based on the current selection. Additionally, any new filters are marked as pinned to the main view.
   */
  const computedSaveFilteredList = useMemo(() => {
    const updatedSaveFilteredList = saveFilteredList.map((savedItem) => {
      const selectedItem = selectedFilters.find(
        (item) => item.id === savedItem.id
      );
      if (selectedItem) {
        return {
          ...savedItem,
          [EDataKeys.SELECTED_TABLE_FILTER]:
            selectedItem[EDataKeys.SELECTED_TABLE_FILTER],
          [EDataKeys.SELECTED_TABLE_CELL]:
            selectedItem[EDataKeys.SELECTED_TABLE_CELL],
        };
      }
      return savedItem;
    });

    const newFilters = _.differenceBy(selectedFilters, saveFilteredList, "id");
    if (!isEdit) {
      _.forEach(
        newFilters,
        (item) => (item[EDataKeys.PIN_TO_MAIN_VIEW] = true)
      );
    }

    const filteredSaveFilteredList = _.intersectionBy(
      updatedSaveFilteredList,
      selectedFilters,
      "id"
    );

    return [...filteredSaveFilteredList, ...newFilters];
  }, [saveFilteredList, selectedFilters, isEdit]);

  useEffect(() => {
    if (!_.isEqual(computedSaveFilteredList, saveFilteredList)) {
      setSaveFilteredList(computedSaveFilteredList);
    }
  }, [
    computedSaveFilteredList,
    saveFilteredList,
    setSaveFilteredList,
    setValue,
  ]);

  const { filteredList, setFilteredList } = useSearch(
    saveFilteredList,
    searchValue
  );

  // useEffect(() => {
  //   if (
  //     saveFilteredList.length > 0 &&
  //     saveFilteredList[0].position === undefined
  //   ) {
  //     const updatedList = saveFilteredList.map((item, index) => ({
  //       ...item,
  //       position: index,
  //     }));
  //     setSaveFilteredList(updatedList);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const handleReorder = (newOrder: IIFilters[]) => {
    // Updating the order of elements in saveFilteredList
    setSaveFilteredList(newOrder);
    // Optional: update the position property of saveFilteredList to match the new order
    const updatedListWithPosition = newOrder.map((item, index) => ({
      ...item,
      position: index,
    }));
    setSaveFilteredList(updatedListWithPosition);
  };

  const updateReportFilters = useMemo(() => {
    const sortedList = _.sortBy(saveFilteredList, "position");
    return _.map(sortedList, (item, index) => ({
      ...item,
      position: index,
    }));
  }, [saveFilteredList]);

  useEffect(() => {
    setSaveFilteredList(updateReportFilters);
  }, []);

  useEffect(() => {
    setValue(EDataKeys.FILTERED_LIST, updateReportFilters);
    console.log(updateReportFilters);
  }, [setValue, updateReportFilters]);

  return (
    <>
      <Reorder.Group
        className={cx("reorder")}
        values={saveFilteredList}
        onReorder={handleReorder}
      >
        <Suspense
          fallback={
            <div className={cx("is-loading")}>
              <DotSpinner />
            </div>
          }
        >
          {filteredList.length > 0 ? (
            <FiltersItem
              filteredList={filteredList}
              setSaveFilteredList={setSaveFilteredList}
            />
          ) : (
            <div className={cx("is-loading")}>
              <DotSpinner />
            </div>
          )}
        </Suspense>
      </Reorder.Group>
    </>
  );
};
