import { FC } from "react";
import classNames from "classnames/bind";
import { createAbbreviation } from "src/utils/helpers";
import { UserLogo } from "../UserLogo/UserLogo";
import styles from "./Person.module.scss";

const cx: CX = classNames.bind(styles);

interface IProps {
  name: string;
  logo: string;
  role: string;
}
export const Person: FC<IProps> = ({ name, logo, role }) => {
  const abbreviation = createAbbreviation(name);

  return (
    <div className={cx("person")}>
      <UserLogo src={logo} title={abbreviation} />
      <div className={cx("name-wrapper")}>
        <div className={cx("name")}>{name.trim() || "Unknown"}</div>
        <div className={cx("position")}>{role}</div>
      </div>
    </div>
  );
};
