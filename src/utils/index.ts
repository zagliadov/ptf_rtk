import { Choice, UpdatedChoice } from "src/types";

export const convertUTCToLocalDate = (date: Date | null) => {
  if (!date) {
    return date;
  }
  date = new Date(date);
  date = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return date;
};

export const convertLocalToUTCDate = (date: Date | null) => {
  if (!date) {
    return date;
  }
  date = new Date(date);
  date = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  return date;
};

/**
 * Transforms an array of Choice objects into an array of UpdatedChoice objects.
 *
 * This function takes an array of objects with `value` and `text` fields,
 * and returns a new array where each object contains `value` and `label` fields.
 * If the input array is `null`, it returns `null`.
 *
 * @param {Choice[] | null} choices - An array of Choice objects or `null`.
 * @returns {UpdatedChoice[] | null} An array of UpdatedChoice objects or `null`.
 */

export const updateChoices = (choices: Choice[]): UpdatedChoice[] | null => {
  if (!choices) return null;

  return choices.map((choice) => ({
    value: choice.value,
    label: choice.text,
  }));
};
