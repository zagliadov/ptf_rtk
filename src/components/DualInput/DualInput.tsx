import { FC, useState, useEffect, ChangeEvent } from "react";
import classnames from "classnames/bind";
import styles from "./DualInput.module.scss";
import { ReactComponent as CheckIcon } from "src/assets/icons/check-icon.svg";
import { ReactComponent as ClearIcon } from "src/assets/icons/clean-icon.svg";
import { Button } from "../Button/Button";
import { IIFilters } from "src/types";
import { RootState, useAppDispatch, useAppSelector } from "src/store/store";
import { confirmFilterChanges } from "src/store/managerSlice";
import { setFilterChoice } from "src/store/filtersSlice";

const cx = classnames.bind(styles);

interface DualInputProps {
  updateFilters: (id: number, values: [string, string]) => void;
  handleSelectChange?: (value: any, name?: string) => void;
  item: IIFilters;
  isAppliedFiltersOverview?: boolean;
}

export const DualInput: FC<DualInputProps> = ({
  updateFilters,
  handleSelectChange,
  item: { choice, id, name },
  isAppliedFiltersOverview = false,
}) => {
  const [min, setMin] = useState<string>("");
  const [max, setMax] = useState<string>("");
  const { reportName } = useAppSelector((state: RootState) => state.report);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setMin("");
    setMax("");
  }, [reportName]);

  useEffect(() => {
    if (choice) {
      try {
        const choiceArray = JSON.parse(choice);
        if (Array.isArray(choiceArray) && choiceArray.length === 2) {
          setMin(choiceArray[0] || "");
          setMax(choiceArray[1] || "");
        }
      } catch (e) {
        console.error("Error parsing JSON:", e);
      }
    } else {
      setMin("");
      setMax("");
    }
  }, [choice, reportName]);

  const handleMinChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = typeof e.target.value === 'string' ? e.target.value.replace(/<.*?>/, "").trim() : "";
    if (/^\d*$/.test(value)) {
      setMin(value);
    }
  };

  const handleMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = typeof e.target.value === 'string' ? e.target.value.replace(/<.*?>/, "").trim() : "";
    if (/^\d*$/.test(value)) {
      setMax(value);
    }
  };

  const handleCheck = () => {
    updateFilters && updateFilters(id, [min.trim(), max.trim()]);
    handleSelectChange && handleSelectChange([min.trim(), max.trim()], name);
    if (isAppliedFiltersOverview) {
      dispatch(confirmFilterChanges(true));
      dispatch(
        setFilterChoice({ choice: [min, max], filterName: name, reportName })
      );
    }
  };

  const handleClear = () => {
    setMin("");
    setMax("");
    handleSelectChange && handleSelectChange("", name);
    updateFilters && updateFilters(id, ["", ""])
    if (isAppliedFiltersOverview) {
      dispatch(confirmFilterChanges(true));
      dispatch(
        setFilterChoice({ choice: [], filterName: name, reportName })
      );
    }
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("input-block-wrapper")}>
        <div className={cx("input-block")}>
          <input
            id="min"
            name="min"
            type="text"
            value={min}
            onChange={handleMinChange}
          />
        </div>
        <div className={cx("divider")}>-</div>
        <div className={cx("input-block")}>
          <input
            id="max"
            name="max"
            type="text"
            value={max}
            onChange={handleMaxChange}
          />
        </div>
      </div>
      <div className={cx("input-control")}>
        <Button
          type="button"
          aria-label="check input"
          icon={<CheckIcon />}
          onClick={handleCheck}
          className={cx("check-button")}
        />
        <Button
          type="button"
          aria-label="clear input"
          icon={<ClearIcon />}
          onClick={handleClear}
          className={cx("clear-button")}
        />
      </div>
    </div>
  );
};
