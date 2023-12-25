import { FC, useState, useEffect, ChangeEvent } from "react";
import classnames from "classnames/bind";
import styles from "./UInput.module.scss";
import { IIFilters } from "src/types";

const cx: CX = classnames.bind(styles);

interface IProps {
  item: IIFilters;
  type: string;
  updateFilters?: (id: number, value: any) => void;
  handleSelectChange?: any;
}
export const UInput: FC<IProps> = ({
  item: { name, choice, id },
  type,
  updateFilters,
  handleSelectChange,
}) => {
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    if (choice && typeof choice === "string") {
      try {
        const choiceItem: string = JSON.parse(choice);
        setValue(choiceItem);
      } catch (e) {
        console.error("Error parsing JSON:", e);
      }
    }
  }, [choice]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue(value);
    updateFilters && updateFilters(id, value);
    handleSelectChange && handleSelectChange(value, name);
  };
  return (
    <div className={cx("wrapper")}>
      <input
        id={String(id)}
        name={name}
        type={type}
        placeholder={name}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};
