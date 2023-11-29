import { FC, useCallback, useState } from "react";
import styles from "./ReportFilterPanel.module.scss";
import classnames from "classnames/bind";
import Search from "src/components/Search";
import { Resource, RolesPersonsSelect } from "src/components/RolesPersonsSelect/RolesPersonsSelect";
import * as _ from "lodash";
import { mockResources } from "../reports";

const cx: CX = classnames.bind(styles);
interface IProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  setResourceFilter: (value: string[]) => void
}
export const ReportFilterPanel: FC<IProps> = ({ searchValue, setSearchValue, setResourceFilter }) => {
  const [selectedResources, setSelectedResources] = useState<Resource[]>([]);
  const handleSearchChange = useCallback((newValue: string): void => {
    setSearchValue(newValue);
  }, [setSearchValue]);

    /**
   * Callback function to handle changes in primary selection.
   * This function updates the list of selected resources and applies a filter
   * based on these resources to the report list.
   *
   * The function first updates the state of selected resources. Then, it extracts
   * the full names of these resources and updates the resource filter used for
   * filtering reports. This ensures that the displayed reports are relevant to
   * the selected resources.
   *
   * @param {Resource[]} newResources - Array of newly selected resources.
   */
    const onPrimaryChange = useCallback((newResources: Resource[]): void => {
      setSelectedResources(newResources);
      const selectedFullNames = _.map(
        newResources,
        (resource) => resource.fullName
      );
      setResourceFilter(selectedFullNames);
    }, [setResourceFilter]);
  
  return (
    <div className={cx("side-menu-filters-wrapper")}>
      <div className={cx("side-menu-filters")}>
        <Search
          onChange={handleSearchChange}
          value={searchValue}
          placeholder={"Search by Reports"}
          width={"100%"}
        />
        <RolesPersonsSelect
          resources={mockResources}
          selectedResources={selectedResources}
          onChange={onPrimaryChange}
        />
      </div>
    </div>
  );
};
