import { FC, useState, useCallback, useEffect } from "react";
import styles from "./AppliedFiltersOverview.module.scss";
import classnames from "classnames/bind";
import Search from "../Search/Search";
import { Button } from "../Button/Button";
import { ReactComponent as DotsIcon } from "src/assets/icons/dots-three-vertical.svg";
import { ReactComponent as FilterIcon } from "src/assets/icons/filter-icon.svg";
import { ReactComponent as HideFiltersIcon } from "src/assets/icons/caret-top-icon.svg";
import { DotThreeMenu } from "../Popups/DotThreeMenu/DotThreeMenu";
import { RootState, useAppDispatch, useAppSelector } from "src/store/store";
import {
  setIsDotThreeMenuOpen,
  setIsEditFiltersOpen,
} from "src/store/managerSlice";
import { useElementSize } from "src/hook/useElementSize";
import { FiltersItem } from "./FiltersItem/FiltersItem";
import { FormProvider, useForm } from "react-hook-form";
// import useCheckOpacity from "src/hook/useCheckVisible";
import { useHoverPositionVisibility } from "src/hook/useHoverPositionVisibility";
import { UniPopup } from "../Popups/UniPopup/UniPopup";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";

const cx: CX = classnames.bind(styles);

interface IProps {
  filterArray: any;
  onFilterChange: any;
  setSearchValue: (value: string) => void;
  searchValue: string;
}
export const AppliedFiltersOverview: FC<IProps> = ({ filterArray, onFilterChange, setSearchValue, searchValue }) => {
  const methods = useForm();
  const dispatch = useAppDispatch();
  const [filtersAreExpanded, setFiltersAreExpanded] = useState<boolean>(false);
  const [showHideFiltersIconWrapper, setShowHideFiltersIconWrapper] =
    useState(false);
  const { elementRef, size } = useElementSize();
  const [visibleBlocks, setVisibleBlocks] = useState<number>(0);
  const { isDotThreeMenuOpen } = useAppSelector(
    (state: RootState) => state.manager
  );
  // const { disabled } = useCheckOpacity(visibleBlocks, filterArray?.length);
  const {
    isVisible: isInfoVisible,
    position: infoPosition,
    handleMouseEnter: handleInfoMouseEnter,
    handleMouseLeave: handleInfoMouseLeave,
  } = useHoverPositionVisibility({});

  useEffect(() => {
    if (filtersAreExpanded) {
      setTimeout(() => setShowHideFiltersIconWrapper(true), 500);
    } else {
      setShowHideFiltersIconWrapper(false);
    }
  }, [filtersAreExpanded]);

  /**
   * Effect to calculate the number of visible filter blocks.
   * This calculation is based on the dimensions of the `filters-side` element.
   * It computes how many blocks can fit per row and the number of rows that can fit in the container,
   * then sets the total number of visible blocks.
   */
  useEffect(() => {
    // Width of a single block including margin
    const blockWidth = 180 + 16;
    // Height of a single block
    const blockHeight = 60;
    // Calculate the number of blocks that can fit in a single row
    // This is determined by dividing the container width by the block width
    const blocksPerRow = Math.floor(size.width / blockWidth);
    // Calculate the number of rows that can fit in the container
    // This is determined by dividing the container height by the block height
    const rows = Math.floor(size.height / blockHeight);
    // Calculate the total number of visible blocks
    // This is the product of the number of blocks per row and the number of rows
    const newVisibleBlocks = blocksPerRow * rows;
    setVisibleBlocks(newVisibleBlocks);
  }, [size.width, size.height, filtersAreExpanded]);

  const toggleMenu = () => {
    dispatch(setIsDotThreeMenuOpen(!isDotThreeMenuOpen));
  };

  const handleSearchChange = useCallback((newValue: string) => {
    setSearchValue(newValue);
  }, [setSearchValue]);

  const handleOpenFilters = useCallback(() => {
    setFiltersAreExpanded(!filtersAreExpanded);
  }, [filtersAreExpanded]);

  const handleOpenAllFilters = () => {
    dispatch(setIsEditFiltersOpen(true));
  };

  return (
    <FormProvider {...methods}>
      <motion.div
        className={cx("applied-filters-wrapper")}
        ref={elementRef}
        animate={{ height: filtersAreExpanded ? "165px" : "92px" }}
        transition={{ duration: 0.1 }}
      >
        <div className={cx("filters-side")}>
          <FiltersItem
            selectedFilters={filterArray}
            visibleBlocks={visibleBlocks}
            onFilterChange={onFilterChange}
          />
        </div>
        {!filtersAreExpanded && (
          <div className={cx("control-side")}>
            <Search
              onChange={handleSearchChange}
              value={searchValue}
              placeholder={"Search by keyword"}
              width={"200px"}
            />
            <Button
              type="button"
              // disabled={!disabled}
              aria-label={"filter-button"}
              icon={<FilterIcon />}
              style={{ width: "40px" }}
              onClick={handleOpenFilters}
            />
            <div className={cx("toggle-menu")}>
              <Button
                type="button"
                aria-label={"extra-menu"}
                icon={<DotsIcon />}
                onClick={toggleMenu}
                style={{ width: "40px" }}
              />
              {isDotThreeMenuOpen && <DotThreeMenu />}
            </div>
          </div>
        )}

        {filtersAreExpanded && (
          <motion.div
            className={cx("hide-filters-icon-wrapper")}
            initial={{ opacity: 0, x: 50 }}
            animate={
              showHideFiltersIconWrapper
                ? { opacity: 1, x: 0 }
                : { opacity: 0, x: 50 }
            }
            transition={{ duration: 0.1 }}
          >
            <Button
              type="button"
              aria-label="hide-filters"
              icon={<HideFiltersIcon />}
              onClick={handleOpenFilters}
              className={cx("hide-filters-icon")}
            />
            <Button
              title="All filters"
              type="button"
              aria-label="All filters"
              onClick={handleOpenAllFilters}
              className={cx("all-filters-button")}
              onMouseEnter={handleInfoMouseEnter}
              onMouseLeave={handleInfoMouseLeave}
            />
          </motion.div>
        )}
      </motion.div>
      {isInfoVisible &&
        ReactDOM.createPortal(
          <UniPopup
            position={infoPosition}
            description={"Configure favorite filters"}
            top={45}
            left={200}
            customStyle={{
              width: "auto",
              borderTopRightRadius: "0px",
              borderTopLeftRadius: "8px",
              borderBottomRightRadius: "8px",
              borderBottomLeftRadius: "8px",
            }}
          />,
          document.body
        )}
    </FormProvider>
  );
};
