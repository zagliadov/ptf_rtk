import { FC, useCallback, useMemo, useState } from "react";
import styles from "./ReportFilterPanel.module.scss";
import classnames from "classnames/bind";
import Search from "src/components/Search";
import {
  Resource,
  RolesPersonsSelect,
} from "src/components/RolesPersonsSelect/RolesPersonsSelect";
import * as _ from "lodash";
import { useGetUserInfoDataQuery } from "src/store/services/userApi";

const cx: CX = classnames.bind(styles);
interface IProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  setResourceFilter: (value: string[]) => void;
}
export const ReportFilterPanel: FC<IProps> = ({
  searchValue,
  setSearchValue,
  setResourceFilter,
}) => {
  const [selectedResources, setSelectedResources] = useState<Resource[]>([]);
  const handleSearchChange = useCallback(
    (newValue: string): void => {
      setSearchValue(newValue);
    },
    [setSearchValue]
  );

  const { data } = useGetUserInfoDataQuery({});

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
  const onPrimaryChange = useCallback(
    (newResources: Resource[]): void => {
      setSelectedResources(newResources);
      const selectedFullNames = _.map(
        newResources,
        (resource) => resource.fullName
      );
      setResourceFilter(selectedFullNames);
    },
    [setResourceFilter]
  );

  const extractData: Resource[] = useMemo(() => {
    return _.chain(data)
      .filter((item) => item["Search Name"] !== null && item["Title"] !== null)
      .map((item) => {
        const emailMatch = item["User"].match(/<(.+?)>/);
        const email = emailMatch ? emailMatch[1] : null;
  
        return {
          fullName: item["Search Name"],
          role: item["Title"],
          id: item["@row.id"],
          province: item["Province"],
          logo: "logo1.png",
          email: email,
        };
      })
      .value();
  }, [data]);

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
          extractData={extractData}
          selectedResources={selectedResources}
          onChange={onPrimaryChange}
        />
      </div>
    </div>
  );
};
