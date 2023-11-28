import { FC, useCallback, useRef, useState } from "react";
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
import { useHoverPositionVisibility } from "src/hook/useHoverPositionVisibility";
import { useSearch } from "src/hook/useSearch";
import * as _ from "lodash";

const cx: CX = classnames.bind(styles);

const options = [
  { label: "apple", value: "apple" },
  { label: "orange", value: "orange" },
  { label: "kiwi", value: "kiwi" },
];

interface IDetail {
  creator: string;
  department: string;
  reportName: string;
  dateCreated: string;
  dateUpdated: string;
  purpose: string;
}

export const SideMenu: FC = () => {
  const [value] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [currentDetail, setCurrentDetail] = useState<IDetail | null>(null);
  const { isVisible, position, handleMouseEnter, handleMouseLeave } =
    useHoverPositionVisibility<IDetail>({
      setDetail: setCurrentDetail,
    });
  const [activeReport, setActiveReport] = useState<number | null>(null);
  const { filteredList, } = useSearch(reports, searchValue);
  const reportsWrapperRef = useRef<HTMLDivElement>(null);
  const maxHeight: string = useElementHeight(reportsWrapperRef, 0);
  const dispatch = useAppDispatch();
  const { isSideMenuOpen } = useAppSelector(
    (state: RootState) => state.manager
  );
  const handleBuildNewReport = (): void => {
    dispatch(setCreateNewReportOpen(true));
  };
  const onPrimaryChange = useCallback((): void => {
    console.log("onPrimaryChange");
  }, []);

  const handleCloseSideMenu = (): void => {
    dispatch(setIsSideMenuOpen(!isSideMenuOpen));
  };

  const handleSearchChange = useCallback((newValue: string): void => {
    setSearchValue(newValue);
  }, []);

  const handleReportsOpen = (id: number): void => {
    setActiveReport(id === activeReport ? null : id);
  };

  const renderItemDetails = (detail: IDetail, index: number): JSX.Element => {
    return (
      <div key={index} className={cx("detail-item")}>
        <span>{detail.reportName}</span>
        <div
          className={cx("info-icon-container")}
          onMouseEnter={(e) => handleMouseEnter(e, detail)}
          onMouseLeave={handleMouseLeave}
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
            type="button"
            aria-label="close-side-menu"
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
              onChange={handleSearchChange}
              value={searchValue}
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
          {_.map(filteredList, ({ id, name, details }: any) => {
            return (
              <div key={id}>
                <div className={cx("reports-item")}>
                  <span className={cx("reports-name")}>{name}</span>
                  <button
                    type="button"
                    className={cx("reports-open-button")}
                    onClick={() => handleReportsOpen(id)}
                    aria-label={"open-report"}
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
      {isVisible &&
        currentDetail &&
        ReactDOM.createPortal(
          <Tooltip
            position={position}
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
