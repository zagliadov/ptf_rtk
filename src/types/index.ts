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
  REPORT_TITLE = "Report Title",
  REPORT_ID = "Report ID",
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
  SELECTED_TABLE_CELL = "selectedTableCell",
  SELECTED_TABLE_FILTER = "selectedTableFilter",
  DISABLED = "disabled",
  COLORIZATION = "colorization",
  NAME = "name",
  CHOICE = "choice",
  CHOICES = "choices",
  TYPE = "type",
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
  ALIAS = "alias",
  DESCRIPTION = "description",
  POSITION = "position",
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
  [EDataKeys.SELECTED_TABLE_CELL]: boolean;
  [EDataKeys.SELECTED_TABLE_FILTER]: boolean;
  [EDataKeys.DISABLED]: boolean;
  [EDataKeys.PIN_TO_MAIN_VIEW]: boolean;
  [EDataKeys.CHOICE]: string | null;
  [EDataKeys.POSITION]: number;
}


export type RData = {
  [EDataKeys.REPORT_TITLE]: string;
  [EDataKeys.DATA_SOURCE]: string;
  [EDataKeys.REPORT_TYPE]: EDataKeys.INTERNAL | EDataKeys.EXTERNAL;
  [EDataKeys.FILTERS]: ColumnData[];
  [EDataKeys.FILTERED_LIST]: IIFilters[];
  [EDataKeys.COLUMN_IDS]: string[];
};

export const ReportDataKeys =  {
  ROW_ID: "@row.id",
  SOURCE_ID: "sourceId",
  COLUMN_IDS: "columnIds",
  FILTERS: "filters",
  TYPE: "type",
  NAME: "name",
  DATE_CREATED: "Date Created",
  DATE_MODIFIED: "Date Modified",
  CREATED_BY: "Created By",
} as const;

export type ReportData = {
  [ReportDataKeys.ROW_ID]: number;
  [ReportDataKeys.SOURCE_ID]: string;
  [ReportDataKeys.COLUMN_IDS]: string;
  [ReportDataKeys.FILTERS]: string;
  [ReportDataKeys.TYPE]: string;
  [ReportDataKeys.NAME]: string;
  [ReportDataKeys.DATE_CREATED]: string;
  [ReportDataKeys.DATE_MODIFIED]: string | null;
  [ReportDataKeys.CREATED_BY]: string;
}