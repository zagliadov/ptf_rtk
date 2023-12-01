import { FC, useRef, useState } from "react";
import styles from "./SideMenu.module.scss";
import classnames from "classnames/bind";
import { RootState, useAppSelector } from "src/store/store";
import { ReactComponent as CaretDownIcon } from "src/assets/icons/caret-down-icon.svg";
import { ReactComponent as InfoIcon } from "src/assets/icons/info-icon.svg";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import "./simplebar.scss";
import { useElementHeight } from "src/hook/useElementHeight";
import { IDetails, reports } from "./reports";
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
import { useAppDispatch } from "src/store/store";
import { setReportId } from "src/store/filtersSlice";

const cx: CX = classnames.bind(styles);

const sideMenuVariants = {
  open: {
    width: "263px",
    transition: { duration: 0.2, ease: "easeIn" },
  },
  closed: {
    width: "32px",
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

export const SideMenu: FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [resourceFilter, setResourceFilter] = useState<string[]>([]);
  const [currentDetail, setCurrentDetail] = useState<IDetails | null>(null);
  const dispatch = useAppDispatch();
  const { isVisible, position, handleMouseEnter, handleMouseLeave } =
    useHoverPositionVisibility<IDetails>({
      setDetail: setCurrentDetail,
    });
  const [activeReport, setActiveReport] = useState<number | null>(null);
  const { filteredList } = useReportSearch(
    reports,
    searchValue,
    resourceFilter
  );
  const reportsWrapperRef = useRef<HTMLDivElement>(null);
  const maxHeight: string = useElementHeight(reportsWrapperRef, 0);
  const { isSideMenuOpen } = useAppSelector(
    (state: RootState) => state.manager
  );

  const handleReportsOpen = (id: number): void => {
    setActiveReport(id === activeReport ? null : id);
  };

  const handleOpenReport = (id: number): void => {
    dispatch(setReportId(id));
  };

  const renderItemDetails = (detail: IDetails, index: number): JSX.Element => {
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
                    ({
                      id,
                      name,
                      details,
                    }: {
                      id: number;
                      name: string;
                      details: IDetails[];
                    }) => {
                      return (
                        <motion.div
                          key={id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          onClick={() => handleOpenReport(id)}
                        >
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
                            <motion.div
                              key={id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.5 }}
                              className={cx("report-details")}
                            >
                              {details.map(renderItemDetails)}
                            </motion.div>
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
