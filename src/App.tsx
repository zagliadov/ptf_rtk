import { FC, useState, useEffect, useRef } from "react";
import styles from "./App.module.scss";
import classnames from "classnames/bind";
import { PopupManager } from "./components/Popups/PopupManager/PopupManager";
import { AppHeader } from "./components/AppHeader/AppHeader";
import { Main } from "./components/Main/Main";
import { DotSpinner } from "./components/DotSpinner/DotSpinner";
import { TableRef } from "./components/DataTable/DataTable";

const cx: CX = classnames.bind(styles);
export const App: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dataTableRef = useRef<TableRef>(null);
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
          <AppHeader dataTableRef={dataTableRef} />
          <Main dataTableRef={dataTableRef} />
          <PopupManager />
        </>
      )}
    </div>
  );
};
