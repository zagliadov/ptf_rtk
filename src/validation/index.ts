import { EDataKeys } from "src/types";
import * as yup from "yup";

export const schema = yup.object({
  [EDataKeys.REPORT_TITLE]: yup
    .string()
    .required("This field is required")
    .max(40, "Name should be at most 40 characters long")
    .transform((value) => value.trim()),
  [EDataKeys.DATA_SOURCE]: yup.string().required("This field is required"),
  [EDataKeys.REPORT_TYPE]: yup
    .string()
    .required("This field is required")
});
