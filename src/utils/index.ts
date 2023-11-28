import { Choice, Colorization, UpdatedChoice } from "src/types";

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

export const formatDate = (dateString: string) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date(dateString);
  let day = date.getDate().toString();
  day = day.length === 1 ? "0" + day : day;
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};
/**
 * Transforms an array of Choice objects into an array of UpdatedChoice objects.
 *
 * This function takes an array of objects with `value` and `text` fields,
 * and returns a new array where each object contains `value`, `label`, and `colorization` fields.
 * The `colorization` field is an optional array of Colorization objects that can be associated with each choice.
 * If the input array is `null`, it returns `null`.
 *
 * @param {Choice[] | null} choices - An array of Choice objects or `null`.
 * @param {Colorization[] | undefined} colorization - An optional array of Colorization objects to be associated with each choice.
 * @returns {UpdatedChoice[] | null} An array of UpdatedChoice objects or `null`, where each object includes `value`, `label`, and `colorization` fields.
 */
export const updateChoices = (
  choices: Choice[],
  colorization: Colorization[] | undefined
): UpdatedChoice[] | null => {
  if (!choices) return null;

  return choices.map((choice) => ({
    value: choice.value,
    label: choice.text,
    colorization: colorization,
  }));
};
