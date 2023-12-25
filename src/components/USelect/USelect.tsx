import { FC, useState, useEffect } from "react";
import { IIFilters, UpdatedChoice } from "src/types";
import Select from "../Select/Select";

interface IProps {
  filter: IIFilters;
  updatedChoices: UpdatedChoice[] | null;
  handleSelectChange?: any;
}
export const USelect: FC<IProps> = ({
  filter: { name, choice },
  updatedChoices,
  handleSelectChange,
}) => {
  const [value, setValue] = useState<string | null>(null);

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

  return (
    <Select
      isPortalTarget={document.body}
      key={`filter-block-${name}`}
      isClearable={true}
      options={updatedChoices as UpdatedChoice[]}
      onChange={(value) => {
        setValue(value);
        handleSelectChange(value, name);
      }}
      placeholder={name}
      value={value}
    />
  );
};
