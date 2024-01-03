import { FC, useState, useEffect, ChangeEvent } from "react";
import classnames from "classnames/bind";
import styles from "./DualInput.module.scss";
import { ReactComponent as CheckIcon } from "src/assets/icons/check-icon.svg";
import { ReactComponent as ClearIcon } from "src/assets/icons/clean-icon.svg";
import { Button } from "../Button/Button";
import { IIFilters } from "src/types";
import { RootState, useAppSelector } from "src/store/store";

const cx = classnames.bind(styles);

interface DualInputProps {
  updateFilters: (id: number, values: [string, string]) => void;
  handleSelectChange?: (value: any, name?: string) => void;
  item: IIFilters;
}

export const DualInput: FC<DualInputProps> = ({
  updateFilters,
  handleSelectChange,
  item: { choice, id, name },
}) => {
  const [min, setMin] = useState<string>("");
  const [max, setMax] = useState<string>("");
  const { reportName } = useAppSelector((state: RootState) => state.report);

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
    const value = e.target.value.replace(/\s+/g, "");
    if (/^\d*$/.test(value)) {
      setMin(value);
    }
  };

  const handleMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "");
    if (/^\d*$/.test(value)) {
      setMax(value);
    }
  };

  const handleCheck = () => {
    updateFilters(id, [min.trim(), max.trim()]);
    handleSelectChange && handleSelectChange([min.trim(), max.trim()], name);
  };

  const handleClear = () => {
    setMin("");
    setMax("");
    handleSelectChange && handleSelectChange("", name);
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
