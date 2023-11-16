import { FC } from "react";
import styles from "./Main.module.scss";
import classnames from "classnames/bind";
import { SideMenu } from "../SideMenu/SideMenu";
import { Button } from "../Button/Button";
import { ReactComponent as DotsIcon } from "src/assets/icons/dots-three-vertical.svg";
import { ReactComponent as FilterIcon } from "src/assets/icons/filter-icon.svg";
import { DotThreeMenu } from "../Popups/DotThreeMenu/DotThreeMenu";
import { RootState, useAppDispatch, useAppSelector } from "src/store/store";
import { setIsDotThreeMenuOpen } from "src/store/managerSlice";

const cx: CX = classnames.bind(styles);

export const Main: FC = () => {
  const { isDotThreeMenuOpen } = useAppSelector(
    (state: RootState) => state.manager
  );
  const dispatch = useAppDispatch();
  const toggleMenu = () => {
    dispatch(setIsDotThreeMenuOpen(!isDotThreeMenuOpen));
  };
  return (
    <main className={cx("main")}>
      <SideMenu />
      <div className={cx("toggle-menu")}>
        <Button
          type="button"
          icon={<DotsIcon />}
          onClick={toggleMenu}
          style={{ width: "40px" }}
        />
        {isDotThreeMenuOpen && <DotThreeMenu />}
      </div>
      <Button type="button" icon={<FilterIcon />} style={{ width: "40px" }} />


      <div className={cx("date-income")}>
        <span>Date income</span>
      </div>
    </main>
  );
};
