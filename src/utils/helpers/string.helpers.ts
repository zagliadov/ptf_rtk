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

export const isISO8601Date = (str: any) => {
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d+)?([+-]\d{2}:\d{2}|Z)$/;
  return regex.test(str);
}
export const formatDateToDDMMMYYYY = (date: any) => {
  return `${('0' + date.getDate()).slice(-2)} ${date.toLocaleString('en-us', { month: 'short' })} ${date.getFullYear()}`;
}

export const formatDate = (dateString: Date): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  return date.toLocaleDateString("en-GB", options);
};

export const isNameExcluded = (name: string, sourceId: string) => {
  return (
    name === "Slip OASIS Old Date" ||
    name === "Slippage IT Opening Date" ||
    name === "Project Health" ||
    name === "POB Cost Status exc. TSA" ||
    name === "Secondary IT Project Director Full Name" ||
    name === "Secondary IT Project Director Abbreviation" ||
    name === "Total Actual TSA Travel Costs" ||
    name === "# Major Milestones / Delay Opening Overdue" ||
    name === "Total Actual Opening - Travel Cost Taskforce" ||
    name === "Total Actual Opening - Development Work Order Trav" ||
    name === "Cost Letter / POB Status" ||
    name === "CLS Health" ||
    name === "Application Inventory Health" ||
    name === "Number of Micros Handhelds" ||
    name === "Number of Digital Signs" ||
    name === "Pre-Opening Services Reservation Systems Training" ||
    name === "Total Actual Opening Services Travel Cost" ||
    name === "Internal Ballpark Estimate Approval Status" ||
    name === "Internal Ballpark Estimate Approval Requested" ||
    name === "Internal Ballpark Estimate Approval Notes" ||
    name === "Internal Ballpark Estimate Approval Requested by" ||
    name === "Pre-Opening Services Opera PMS Training Cost" ||
    name === "Pre-Opening Services Opera S&C Training Cost" ||
    name === "Pre-Opening Services Reservation Training Cost" ||
    name === "Pre-Opening Services Opera PMS Travel Cost" ||
    name === "Pre-Opening Services Opera S&C travel Cost" ||
    name === "Pre-Opening Services Reservation Conversion Cost" ||
    name === "Actual Costs Tracking Status" ||
    name === "Actual Cost of Other (Stay, Meals etc.) (€)" ||
    name === "Estimated Cost of Other (Stay, Meals etc.) (€)" ||
    (sourceId === "Ticket" && name === "Status")
  );
};
