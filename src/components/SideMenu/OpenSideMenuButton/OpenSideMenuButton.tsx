import { AnimatePresence, motion } from "framer-motion";
import { FC } from "react";
import styles from "./OpenSideMenuButton.module.scss";
import classnames from "classnames/bind";
import { RootState, useAppDispatch, useAppSelector } from "src/store/store";
import { setIsSideMenuOpen } from "src/store/managerSlice";
import { ReactComponent as ArrowIcon } from "src/assets/icons/arrow-left.svg";

const cx: CX = classnames.bind(styles);

export const OpenSideMenuButton: FC = () => {
  const dispatch = useAppDispatch();
  const { isSideMenuOpen } = useAppSelector(
    (state: RootState) => state.manager
  );
  const handleCloseSideMenu = (): void => {
    dispatch(setIsSideMenuOpen(!isSideMenuOpen));
  };

  return (
    <AnimatePresence>
      {!isSideMenuOpen && (
        <motion.button
          type="button"
          aria-label="open-side-menu"
          className={cx("arrow-icon-open-wrapper")}
          onClick={handleCloseSideMenu}
          initial={{ display: "none", opacity: 0, position: "absolute" }}
          animate={{ display: "flex", opacity: 1 }}
          exit={{ display: "none" }}
          transition={{ duration: 1 }}
        >
          <ArrowIcon className={cx("arrow-icon-rotated")} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
