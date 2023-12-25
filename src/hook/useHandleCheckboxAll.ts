import { useMemo, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { EDataKeys, IIFilters } from "src/types";
import * as _ from "lodash";

/**
 * Custom React hook to manage the state and behavior of a "select all" checkbox and a reset functionality.
 *
 * @param {IIFilters[]} initialFilters - The initial state of filters to be managed.
 * @param {(filters: IIFilters[]) => void} setFilters - Function to update the state of filters.
 * @returns {object} An object containing the checked state of the checkbox (`isChecked`),
 *                   the function to handle checkbox changes (`handleCheckedAll`),
 *                   and the function to reset all checkboxes (`handleResetAll`).
 *
 * This hook maintains the state of a "select all" checkbox and updates the check status of an array of filters
 * based on user interaction. It automatically sets its state based on whether all filters are initially checked.
 * When the "select all" checkbox state changes, it updates all filters' `selectedTableCell` property to match the state
 * of the "select all" checkbox. Additionally, the hook provides a `handleResetAll` function to reset the state
 * of all filters, setting their `selectedTableCell` and `selectedTableFilter` properties to false.
 *
 * `useFormContext` from `react-hook-form` is used to access the form context for state management.
 *
 * @example
 * const { isChecked, handleCheckedAll, handleResetAll } = useHandleCheckboxAll(filters, setFilters);
 * Use `isChecked` for the checkbox's checked property
 * Use `handleCheckedAll` as the onChange handler for the "select all" checkbox
 * Use `handleResetAll` as an onClick handler for a reset button
 */
export const useHandleCheckboxAll = (
  initialFilters: IIFilters[],
  setFilters: (filters: IIFilters[]) => void
) => {
  const { setValue, watch } = useFormContext();

  const isChecked: boolean = useMemo(
    () => _.every(initialFilters, "selectedTableCell"),
    [initialFilters]
  );

  const handleCheckedAll = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const checked = e.target.checked;

      const arr: IIFilters[] = watch(EDataKeys.FILTERS);
      /**
       * @description For each filter in `arr`, a new filter object is created that copies
       * all properties of the existing filter and updates the following properties:
       * - `selectedTableCell`: Set to the value of `checked`.
       * - `selectedTableFilter`: Set to `checked` if the filter is not disabled
       * (`DISABLED` is not true), otherwise set to `false`.
       */
      const newFilters: IIFilters[] = _.map(arr, (item: IIFilters) => ({
        ...item,
        selectedTableCell: checked,
        selectedTableFilter: item[EDataKeys.DISABLED] ? false : checked,
      }));

      setFilters(newFilters);
      setValue(EDataKeys.FILTERS, newFilters);
    },
    [setFilters, setValue, watch]
  );

  const handleResetAll = useCallback((): void => {
    const arr: IIFilters[] = watch(EDataKeys.FILTERS);
    const newFilters: IIFilters[] = _.map(arr, (item: IIFilters) => ({
      ...item,
      selectedTableCell: false,
      selectedTableFilter: false,
    }));
    setFilters(newFilters);
    setValue(EDataKeys.FILTERS, newFilters);
  }, [setFilters, setValue, watch]);

  return { isChecked, handleCheckedAll, handleResetAll };
};
