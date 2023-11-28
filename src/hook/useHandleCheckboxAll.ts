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
 * When the "select all" checkbox state changes, it updates all filters' `checked1` property to match the state
 * of the "select all" checkbox. Additionally, the hook provides a `handleResetAll` function to reset the state
 * of all filters, setting their `checked1` and `checked2` properties to false.
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
    () => _.every(initialFilters, "checked1"),
    [initialFilters]
  );

  const handleCheckedAll = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const checked = e.target.checked;

      const arr: IIFilters[] = watch(EDataKeys.FILTERS);
      const newFilters: IIFilters[] = _.map(arr, (item: IIFilters) => ({
        ...item,
        checked1: checked,
        checked2: item.checked1 && false,
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
      checked1: false,
      checked2: false,
    }));
    setFilters(newFilters);
    setValue(EDataKeys.FILTERS, newFilters);
  }, [setFilters, setValue, watch]);

  return { isChecked, handleCheckedAll, handleResetAll };
};
