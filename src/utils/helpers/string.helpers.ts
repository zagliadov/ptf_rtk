import * as _ from "lodash";

/**
 * Creates an abbreviation from the provided name.
 *
 * @param {string} name - The full name from which to create the abbreviation.
 * @returns {string} The abbreviation formed from the first letters of each word in the name.
 */
export const createAbbreviation = (name: string) => {
  return _.chain(name)
    .split(" ")
    .map(_.upperFirst)
    .map((item) => _.head(item))
    .join("")
    .value();
};
