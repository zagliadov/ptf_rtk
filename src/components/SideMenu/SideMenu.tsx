import { FC, useRef, useState } from "react";
import styles from "./SideMenu.module.scss";
import classnames from "classnames/bind";
import { RootState, useAppDispatch, useAppSelector } from "src/store/store";
import { ReactComponent as ArrowIcon } from "src/assets/icons/arrow-left.svg";
import { ReactComponent as CaretDownIcon } from "src/assets/icons/caret-down-icon.svg";
import { ReactComponent as InfoIcon } from "src/assets/icons/info-icon.svg";
import {
  setCreateNewReportOpen,
  setIsSideMenuOpen,
} from "src/store/managerSlice";
import Search from "../Search";
import Select from "../Select";
import { Button } from "../Button/Button";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import "./simplebar.scss";
import { useElementHeight } from "src/hook/useElementHeight";
import { reports } from "./reports";
import { Tooltip } from "../Tooltip/Tooltip";
import ReactDOM from "react-dom";

const cx: CX = classnames.bind(styles);

const options = [
  { label: "apple", value: "apple" },
  { label: "orange", value: "orange" },
  { label: "kiwi", value: "kiwi" },
];

export const SideMenu: FC = () => {
  const [value] = useState<string>("");
  const [currentDetail, setCurrentDetail] = useState<any>(null);
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);
  const [tooltipPosition, setTooltipPosition] = useState<any>({
    top: 0,
    left: 0,
  });
  const [activeReport, setActiveReport] = useState<number | null>(null);

  const reportsWrapperRef = useRef<HTMLDivElement>(null);
  const maxHeight = useElementHeight(reportsWrapperRef, 0);
  const dispatch = useAppDispatch();
  const { isSideMenuOpen } = useAppSelector(
    (state: RootState) => state.manager
  );
  const handleBuildNewReport = () => {
    dispatch(setCreateNewReportOpen(true));
  };
  const onPrimaryChange = () => {
    console.log("onPrimaryChange");
  };

  const handleCloseSideMenu = () => {
    dispatch(setIsSideMenuOpen(!isSideMenuOpen));
  };

  const handleResetSearch = () => {};

  const handleReportsOpen = (id: number) => {
    setActiveReport(id === activeReport ? null : id);
  };

  const handleMouseEnter = (detail: any, rect: DOMRect) => {
    setCurrentDetail(detail);
    setTooltipPosition({
      top: rect.top + window.scrollY,
      left: rect.right + window.scrollX,
    });
    setTooltipVisible(true);
  };

  const renderItemDetails = (detail: any, index: any) => {
    return (
      <div key={index} className={cx("detail-item")}>
        <span>{detail.reportName}</span>
        <div
          className={cx("info-icon-container")}
          onMouseEnter={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            handleMouseEnter(detail, rect);
          }}
          onMouseLeave={() => {
            setTooltipVisible(false);
            setCurrentDetail(null);
          }}
        >
          <InfoIcon />
        </div>
      </div>
    );
  };

  return (
    <div className={cx("side-menu")}>
      <div className={cx("side-menu-header-wrapper")}>
        <div className={cx("side-menu-header")}>
          <span>Created Reports</span>
          <button
            className={cx("arrow-icon-wrapper")}
            onClick={handleCloseSideMenu}
          >
            <ArrowIcon
              className={cx({ "arrow-icon-rotated": isSideMenuOpen })}
            />
          </button>
        </div>
        <div className={cx("side-menu-filters-wrapper")}>
          <div className={cx("side-menu-filters")}>
            <Search
              onChange={handleResetSearch}
              value={""}
              placeholder={"Search by Reports"}
              width={"100%"}
            />
            <Select
              options={options}
              value={value}
              onChange={onPrimaryChange}
              placeholder="Roles, Persons"
            />
          </div>
        </div>
      </div>
      <div ref={reportsWrapperRef} className={cx("side-menu-reports-wrapper")}>
        <SimpleBar
          style={{ maxHeight }}
          className="my-custom-scrollbar-sidebar"
        >
          {reports.map(({ id, reportsName, details }) => {
            return (
              <div key={id}>
                <div className={cx("reports-item")}>
                  <span className={cx("reports-name")}>{reportsName}</span>
                  <button
                    className={cx("reports-open-button")}
                    onClick={() => handleReportsOpen(id)}
                  >
                    <CaretDownIcon
                      className={cx({
                        "reports-icon-rotated": activeReport === id,
                      })}
                    />
                  </button>
                </div>
                {activeReport === id && (
                  <div className={cx("report-details")}>
                    {details.map(renderItemDetails)}
                  </div>
                )}
              </div>
            );
          })}
        </SimpleBar>
      </div>
      <div className={cx("side-menu-footer")}>
        <Button
          primary
          title="Build New Report"
          onClick={handleBuildNewReport}
          style={{ width: "231px" }}
        />
      </div>
      {tooltipVisible &&
        currentDetail &&
        ReactDOM.createPortal(
          <Tooltip
            position={tooltipPosition}
            content={[
              `Creator: ${currentDetail.creator}`,
              `Department: ${currentDetail.department}`,
              `Date Created: ${currentDetail.dateCreated}`,
              `Date Updated: ${currentDetail.dateUpdated}`,
              `Purpose: ${currentDetail.purpose}`,
            ]}
          />,
          document.body
        )}
    </div>
  );
};
