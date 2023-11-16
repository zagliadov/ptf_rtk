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

export enum EDataKeys {
  REPORT_TITLE = "Report title",
  DATA_SOURCE = "Data Source",
  REPORT_TYPE = "Report Type",
  EXTERNAL = "External",
  INTERNAL = "Internal",
  FILTERS = "Filters",
  TYPE_HTML = "Html",
  TYPE_NUMERIC = "Numeric",
  TYPE_TEXT = "Text",
  TYPE_URL = "URL",
  TYPE_DATE = "Date",
  TYPE_USER = "User",
  TYPE_ATTACHMENT = "Attachment",
  TYPE_PHONE = "Phone",
  TYPE_TIMESTAMP = "Timestamp",
  TYPE_EMAIL = "Email",
  TYPE_MULTILINE = "Multiline",
  TYPE_AUTONUMBER = "Autonumber",
  TYPE_LOCATION = "Location",
  TYPE_RECORD_SET = "RecordSet",
  TYPE_DURATION = "Duration",
}

type Colorization = {
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
  name: string;
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
  checked1: boolean;
  checked2: boolean;
}


export type RData = {
  [EDataKeys.REPORT_TITLE]: string;
  [EDataKeys.DATA_SOURCE]: string;
  [EDataKeys.REPORT_TYPE]: string;
  [EDataKeys.FILTERS]: ColumnData[];
};
