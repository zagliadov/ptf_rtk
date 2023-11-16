import { FC, useRef } from "react";
import styles from "./Filters.module.scss";
import classnames from "classnames/bind";
import { PopupHeader } from "../PopupHeader/PopupHeader";
import { ButtonWrapper } from "src/components/ButtonWrapper/ButtonWrapper";
import { Button } from "src/components/Button/Button";
import { useAppDispatch } from "src/store/store";
import {
  setIsFiltersOpen,
  setColumnSelectorOpen,
  setIsSaveNewReportOpen,
} from "src/store/managerSlice";
import Search from "src/components/Search";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import "./simplebar.scss";
import { useElementHeight } from "src/hook/useElementHeight";
import { useFormContext } from "react-hook-form";
import { FilteredColumns } from "./FilteredColumns/FilteredColumns";

const cx: CX = classnames.bind(styles);

export const Filters: FC = () => {
  const { handleSubmit } = useFormContext();

  const filtersWrapperRef = useRef<HTMLDivElement>(null);
  const maxHeight = useElementHeight(filtersWrapperRef);
  const dispatch = useAppDispatch();
  const handleCloseFilters = () => {
    dispatch(setIsFiltersOpen(false));
    dispatch(setColumnSelectorOpen(true));
    dispatch(setIsSaveNewReportOpen(false));
  };

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
    dispatch(setIsSaveNewReportOpen(true));
  };

  const handleResetAll = () => {
    console.log("Reset all");
  };

  const handleResetColumns = () => {
    console.log("Reset Columns");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
    <div className={cx("filters")}>
      <div className={cx("filters-header-wrapper")}>
        <PopupHeader
          title={"Filters"}
          description={
            "Apply filters, set the order and select favorites to build report"
          }
          onClose={handleCloseFilters}
        />
        <div className={cx("search-wrapper")}>
          <Search
            onChange={handleResetColumns}
            value={""}
            placeholder={"Search by Filter"}
            width={"100%"}
          />
        </div>
      </div>

      <div ref={filtersWrapperRef} className={cx("filters-wrapper")}>
        <SimpleBar
          style={{ maxHeight }}
          className="my-custom-scrollbar-filters"
        >
          <FilteredColumns />
        </SimpleBar>
      </div>
      <div className={cx("filters-footer")}>
        <ButtonWrapper shift={"right"}>
          <Button
            primary
            title="Create report"
            type="submit"
            style={{ width: "134px" }}
          />
          <Button
            title="Reset all"
            onClick={handleResetAll}
            style={{ width: "86px", marginLeft: "16px" }}
          />
        </ButtonWrapper>
      </div>
    </div>
    </form>
  );
};
