import { FC } from "react";
import { ReactComponent as ArrowIcon } from "src/assets/icons/arrow-left.svg";
import styles from "./SideMenuHeader.module.scss";
import classnames from "classnames/bind";
import { RootState, useAppDispatch, useAppSelector } from "src/store/store";
import { setIsSideMenuOpen } from "src/store/managerSlice";

const cx: CX = classnames.bind(styles);

export const SideMenuHeader: FC = () => {
  const dispatch = useAppDispatch();
  const { isSideMenuOpen } = useAppSelector(
    (state: RootState) => state.manager
  );
  const handleCloseSideMenu = (): void => {
    dispatch(setIsSideMenuOpen(!isSideMenuOpen));
  };

  return (
    <div className={cx("side-menu-header")}>
      <span>Created Reports</span>
      <button
        type="button"
        aria-label="close-side-menu"
        className={cx("arrow-icon-wrapper")}
        onClick={handleCloseSideMenu}
      >
        <ArrowIcon />
      </button>
    </div>
  );
};
