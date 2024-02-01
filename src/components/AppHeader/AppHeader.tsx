import { FC, RefObject, useCallback } from "react";
import styles from "./AppHeader.module.scss";
import classnames from "classnames/bind";
import { Button } from "../Button/Button";
import { ReactComponent as GetFilePDFIcon } from "src/assets/icons/get-file-pdf-icon.svg";
import { ReactComponent as ExcelTableIcon } from "src/assets/icons/excel-table-icon.svg";
import { TableRef } from "../DataTable/DataTable";

const cx: CX = classnames.bind(styles);

interface IProps {
  dataTableRef: RefObject<TableRef>;
}

export const AppHeader: FC<IProps> = ({ dataTableRef }) => {
  const handleExportExcel = useCallback(() => {
    dataTableRef.current?.exportExcel();
  }, [dataTableRef]);

  const handleExportPdf = useCallback(() => {
    dataTableRef.current?.exportPdf();
  }, [dataTableRef]);

  return (
    <header className={cx("app-header")}>
      <div className={cx("app-header-content-wrapper")}>
        <div className={cx("app-header-content-wrapper-logo")}>
          <h1>Report Builder</h1>
        </div>

        <div className={cx("app-header-content-wrapper-button")}>
          <div className={cx("export-pdf-wrapper")}>
            <Button
              primary
              icon={<GetFilePDFIcon />}
              title="PDF"
              onClick={handleExportPdf}
              style={{ width: "83px" }}
            />
          </div>

          <Button
            primary
            icon={<ExcelTableIcon />}
            title="Excel"
            onClick={handleExportExcel}
            style={{ width: "91px" }}
          />
        </div>
      </div>
    </header>
  );
};
