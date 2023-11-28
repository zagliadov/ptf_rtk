import { Argument } from "classnames";

declare global {
  type CX = (...args: Argument[]) => string;
}

export type Choice = {
  value: string;
  text: string;
};
export interface UpdatedChoice {
  value: string;
  label: string;
}

export type DynamicFormData = Record<string, any>;
export type SourceType = Record<EDataKeys.DATA_SOURCE | EDataKeys.API, EDataKeys>;

export enum EDataKeys {
  REPORT_TITLE = "Report title",
  DATA_SOURCE = "Data Source",
  DATA_SOURCE_SITE = "Site",
  DATA_SOURCE_PROJECT = "Project",
  DATA_SOURCE_TRAVEL_REQUEST = "Travel request",
  DATA_SOURCE_TICKET = "Ticket",
  API_DATA_WAREHOUSE = "API Data Warehouse",
  API_VIEW = "API View",
  API = "API",
  COLUMN_IDS = "columnIds",
  REPORT_TYPE = "Report Type",
  PIN_TO_MAIN_VIEW = "pinToMainView",
  FILTERED_LIST = "Filtered List",
  CHECKED1 = "checked1",
  CHECKED2 = "checked2",
  COLORIZATION = "colorization",
  NAME = "name",
  CHOICE = "choice",
  EXTERNAL = "External",
  INTERNAL = "Internal",
  FILTERS = "Filters",
  TYPE_NUMERIC = "Numeric",
  TYPE_TEXT = "Text",
  TYPE_URL = "URL",
  TYPE_DATE = "Date",
  TYPE_USER = "User",
  TYPE_PHONE = "Phone",
  TYPE_TIMESTAMP = "Timestamp",
  TYPE_EMAIL = "Email",
  TYPE_MULTILINE = "Multiline",
  TYPE_AUTONUMBER = "Autonumber",
  TYPE_LOCATION = "Location",
  TYPE_RECORD_SET = "RecordSet",
  TYPE_DURATION = "Duration",
}

export type Colorization = {
  pattern?: string;
  color: string;
};

type Reference = {
  table: string;
  type: string;
  view: string;
};

export type  ColumnData = {
  id: number;
  [EDataKeys.NAME]: string;
  alias: string;
  description?: string;
  type: 'Html' | 'Numeric' | 'Text' | 'URL' | 'Date' | 'User' | 'Attachment' | 'Phone' | 'Timestamp' | 'Email' | 'Multiline' | 'Autonumber' | 'Location' | 'RecordSet' | 'Duration';
  kind: 'Formula' | 'Updatable' | 'Lookup' | 'LastModifiedBy' | 'DateModified' | 'Summary' | 'Key' | 'RecordOwner' | 'CreatedBy' | 'DateCreated';
  displayOptions: string;
  format?: string;
  hasDefault: boolean;
  readOnly: boolean;
  dataOptions?: string;
  width?: number;
  choices?: Choice[] | UpdatedChoice[];
  colorization?: Colorization[];
  reference?: Reference;
};

export interface IIFilters extends ColumnData {
  [EDataKeys.CHECKED1]: boolean;
  [EDataKeys.CHECKED2]: boolean;
  [EDataKeys.PIN_TO_MAIN_VIEW]: boolean;
  [EDataKeys.CHOICE]: string | null;
}


export type RData = {
  [EDataKeys.REPORT_TITLE]: string;
  [EDataKeys.DATA_SOURCE]: string;
  [EDataKeys.REPORT_TYPE]: EDataKeys.INTERNAL | EDataKeys.EXTERNAL;
  [EDataKeys.FILTERS]: ColumnData[];
  [EDataKeys.FILTERED_LIST]: IIFilters[];
  [EDataKeys.COLUMN_IDS]: string[];
};
