import { FC, useEffect, useState } from "react";
import classnames from "classnames/bind";
import { ButtonWrapper } from "src/components/ButtonWrapper/ButtonWrapper";
import { Button } from "src/components/Button/Button";
import { PopupHeader } from "../PopupHeader/PopupHeader";
import { useAppDispatch } from "src/store/store";
import {
  setColumnSelectorOpen,
  setCreateNewReportOpen,
} from "src/store/managerSlice";
import Search from "src/components/Search";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import styles from "./ColumnSelector.module.scss";
import "./simplebar.scss";
import { ColumnListHeader } from "./ColumnListHeader/ColumnListHeader";
import { ColumnList } from "./ColumnList/ColumnList";
import { useFormContext } from "react-hook-form";
import { EDataKeys, RData } from "src/types";
import { useGetFiltersDescribeDataQuery } from "src/store/services/filtersApi";
import { DotSpinner } from "src/components/DotSpinner/DotSpinner";

const cx: CX = classnames.bind(styles);

interface IProps {
  onContinue: () => void;
}

export const ColumnSelector: FC<IProps> = ({ onContinue }) => {
  const { register, handleSubmit, watch } = useFormContext();
  const [searchValue, setSearchValue] = useState<string>("");
  const { isLoading } = useGetFiltersDescribeDataQuery(
    watch(EDataKeys.DATA_SOURCE)
  );
  const dispatch = useAppDispatch();
  const handleCloseColumnSelector = () => {
    dispatch(setColumnSelectorOpen(false));
    dispatch(setCreateNewReportOpen(true));
  };

  useEffect(() => {
    register(EDataKeys.FILTERS);
  }, [register]);

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
    onContinue();
  };

  const handleResetColumns = () => {
    console.log("Reset Columns");
  };

  const handleSearchChange = (newValue: string) => {
    setSearchValue(newValue);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={cx("column-selector")}>
        <PopupHeader
          title={"Column Selector"}
          onClose={handleCloseColumnSelector}
        />
        <div className={cx("column-wrapper")}>
          <div className={cx("search-wrapper")}>
            <Search
              onChange={handleSearchChange}
              value={searchValue}
              placeholder={"Search by Column"}
              width={"269px"}
            />
          </div>

          <div className={cx("column-list")}>
            <ColumnListHeader />
            <SimpleBar
              style={{ maxHeight: "403px" }}
              className="my-custom-scrollbar-column"
            >
              {isLoading ? (
                <div className={cx("is-loading")}>
                  <DotSpinner />
                </div>
              ) : (
                <ColumnList searchValue={searchValue} />
              )}
            </SimpleBar>
          </div>
        </div>
        <ButtonWrapper shift={"left"}>
          <Button
            primary
            type="submit"
            title="Configure filters"
            style={{ width: "132px" }}
          />
          <Button
            title="Reset Columns"
            onClick={handleResetColumns}
            style={{ width: "128px", marginLeft: "16px" }}
          />
        </ButtonWrapper>
      </div>
    </form>
  );
};
