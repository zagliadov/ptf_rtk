import { FC, useState, useEffect } from "react";
import styles from "./App.module.scss";
import classnames from "classnames/bind";
import { PopupManager } from "./components/Popups/PopupManager/PopupManager";
import { AppHeader } from "./components/AppHeader/AppHeader";
import { Main } from "./components/Main/Main";
import { DotSpinner } from "./components/DotSpinner/DotSpinner";

const cx: CX = classnames.bind(styles);
export const App: FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div className={cx("app")}>
      {isLoading && (
        <div className={cx("is-loading")}>
          <DotSpinner />
        </div>
      )}
      {!isLoading && (
        <>
          <AppHeader />
          <Main />
          <PopupManager />
        </>
      )}
    </div>
  );
};
