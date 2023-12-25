import { FC, useEffect, useRef, useState } from "react";
import styles from "./SideMenu.module.scss";
import classnames from "classnames/bind";
import { RootState, useAppDispatch, useAppSelector } from "src/store/store";
import { ReactComponent as CaretDownIcon } from "src/assets/icons/caret-down-icon.svg";
import { ReactComponent as InfoIcon } from "src/assets/icons/info-icon.svg";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import "./simplebar.scss";
import { useElementHeight } from "src/hook/useElementHeight";
import { IDetails } from "./reports";
import { Tooltip } from "../Tooltip/Tooltip";
import ReactDOM from "react-dom";
import { useHoverPositionVisibility } from "src/hook/useHoverPositionVisibility";
import * as _ from "lodash";
import { motion, AnimatePresence } from "framer-motion";
import { useReportSearch } from "src/hook/useReportSearch";
import { ReportFilterPanel } from "./ReportFilterPanel/ReportFilterPanel";
import { SideMenuHeader } from "./SideMenuHeader/SideMenuHeader";
import { OpenSideMenuButton } from "./OpenSideMenuButton/OpenSideMenuButton";
import { SideMenuFooter } from "./SideMenuFooter/SideMenuFooter";
import { SourceReports } from "src/hook/useSideMenuReports";
import { setBasicReportData } from "src/store/reportSlice";
import { EDataKeys } from "src/types";

const cx: CX = classnames.bind(styles);

const sideMenuVariants = {
  open: {
    width: "263px",
    transition: { duration: 0.2, ease: "easeIn" },
  },
  closed: {
    width: "35px",
    paddingTop: "14px",
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const contentVariants = {
  open: {
    opacity: 1,
    transition: { duration: 0.8, ease: "easeIn" },
  },
  closed: {
    opacity: 0,
    transition: { duration: 0.1, ease: "easeIn" },
  },
};

interface IProps {
  reportsArray: SourceReports[];
}
export const SideMenu: FC<IProps> = ({ reportsArray }) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const dispatch = useAppDispatch();
  const [resourceFilter, setResourceFilter] = useState<string[]>([]);
  const [currentDetail, setCurrentDetail] = useState<IDetails | null>(null);
  const { isVisible, position, handleMouseEnter, handleMouseLeave } =
    useHoverPositionVisibility<IDetails>({
      setDetail: setCurrentDetail,
    });
  const [activeReport, setActiveReport] = useState<string | null>(null);
  const { filteredList } = useReportSearch(
    reportsArray,
    searchValue,
    resourceFilter
  );
  const reportsWrapperRef = useRef<HTMLDivElement>(null);
  const maxHeight: string = useElementHeight(reportsWrapperRef, 0);
  const { isSideMenuOpen } = useAppSelector(
    (state: RootState) => state.manager
  );

  const { reportSourceId, reportName } = useAppSelector(
    (state: RootState) => state.report
  );

  useEffect(() => {
    if (reportSourceId && reportName) {
      setActiveReport(reportSourceId);
    }
  }, [reportSourceId, reportName]);

  const handleReportsOpen = (sourceId: string): void => {
    setActiveReport(sourceId === activeReport ? null : sourceId);
  };

  const handleGetReport = (
    rowId: number,
    name: string,
    sourceId: string,
    reportType: EDataKeys.INTERNAL | EDataKeys.EXTERNAL
  ): void => {
    dispatch(
      setBasicReportData({
        reportId: rowId,
        reportName: name,
        reportSourceId: sourceId,
        reportType,
      })
    );
  };

  return (
    <motion.div
      className={cx("side-menu")}
      variants={sideMenuVariants}
      animate={isSideMenuOpen ? "open" : "closed"}
    >
      <AnimatePresence>
        {isSideMenuOpen && (
          <motion.div
            className={cx("side-menu-content")}
            variants={contentVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className={cx("side-menu-header-wrapper")}>
              <SideMenuHeader />
              <ReportFilterPanel
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                setResourceFilter={setResourceFilter}
              />
            </div>
            <div
              ref={reportsWrapperRef}
              className={cx("side-menu-reports-wrapper")}
            >
              <SimpleBar
                style={{ maxHeight }}
                className="my-custom-scrollbar-sidebar"
              >
                {!_.isEmpty(filteredList) &&
                  _.map(
                    filteredList,
                    ({ sourceId, reports }: SourceReports) => {
                      const readableSourceId = decodeURIComponent(sourceId);
                      return (
                        <motion.div
                          key={readableSourceId}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div
                            className={cx("reports-item")}
                            onClick={() => handleReportsOpen(readableSourceId)}
                          >
                            <span className={cx("reports-name")}>
                              {readableSourceId}
                            </span>
                            <button
                              type="button"
                              className={cx("reports-open-button")}
                              aria-label={"open-report"}
                            >
                              <CaretDownIcon
                                className={cx({
                                  "reports-icon-rotated":
                                    activeReport === readableSourceId,
                                })}
                              />
                            </button>
                          </div>
                          {activeReport === readableSourceId &&
                            _.map(
                              reports,
                              (
                                { name, type, details, "@row.id": rowId },
                                index
                              ) => {
                                return (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className={cx("report-details")}
                                  >
                                    <div
                                      key={rowId}
                                      className={cx(
                                        "detail-item",
                                        name === reportName && "active"
                                      )}
                                      onClick={() =>
                                        handleGetReport(
                                          rowId,
                                          name,
                                          sourceId,
                                          type
                                        )
                                      }
                                    >
                                      <span>{name}</span>
                                      <div
                                        className={cx("info-icon-container")}
                                        onMouseEnter={(e) =>
                                          handleMouseEnter(e, details[0])
                                        }
                                        onMouseLeave={handleMouseLeave}
                                      >
                                        <InfoIcon />
                                      </div>
                                    </div>
                                  </motion.div>
                                );
                              }
                            )}
                        </motion.div>
                      );
                    }
                  )}
              </SimpleBar>
            </div>
            <SideMenuFooter />
          </motion.div>
        )}
      </AnimatePresence>
      <OpenSideMenuButton />

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
    </motion.div>
  );
};
