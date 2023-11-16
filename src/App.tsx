import { FC } from "react";
import styles from "./App.module.scss";
import classnames from "classnames/bind";
import { PopupManager } from "./components/Popups/PopupManager/PopupManager";
import { AppHeader } from "./components/AppHeader/AppHeader";
import { Main } from "./components/Main/Main";

const cx: CX = classnames.bind(styles);
export const App: FC = () => {
  return (
    <div className={cx("app")}>
      <AppHeader />
      <Main />
      <PopupManager />
    </div>
  );
};
