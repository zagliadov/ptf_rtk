import { FC, useCallback } from "react";
import styles from "./AppHeader.module.scss";
import classnames from "classnames/bind";
import { Button } from "../Button/Button";
import { ReactComponent as LinkIcon } from "src/assets/icons/link-icon.svg";
import { ReactComponent as GetFilePDFIcon } from "src/assets/icons/get-file-pdf-icon.svg";
import { ReactComponent as ExcelTableIcon } from "src/assets/icons/excel-table-icon.svg";
import { RootState, useAppSelector } from "src/store/store";

const cx: CX = classnames.bind(styles);
export const AppHeader: FC = () => {
  const { reportName, reportSourceId, reportType, reportId } = useAppSelector((state: RootState) => state.report);
  const handleGetApiUrl = useCallback(async () => {
    console.log("handleGetApiUrl");
  }, []);


  return (
    <header className={cx("app-header")}>
      <div className={cx("app-header-content-wrapper")}>
        <div className={cx("app-header-content-wrapper-logo")}>
          <h1>Report Builder</h1>
          <div>
            <span>reportName: {reportName}| </span>
            <span>reportSourceId: {reportSourceId}| </span>
            <span>reportType: {reportType}| </span>
            <span>reportId: {reportId}| </span>
          </div>
        </div>

        <div className={cx("app-header-content-wrapper-button")}>
          <Button
            primary
            icon={<LinkIcon />}
            title="Get API URL"
            onClick={handleGetApiUrl}
            style={{ width: "134px" }}
          />
          <Button
            primary
            icon={<GetFilePDFIcon />}
            title="PDF"
            onClick={handleGetApiUrl}
            style={{ width: "83px" }}
          />
          <Button
            primary
            icon={<ExcelTableIcon />}
            title="Excel"
            onClick={handleGetApiUrl}
            style={{ width: "91px" }}
          />
        </div>
      </div>
    </header>
  );
};
