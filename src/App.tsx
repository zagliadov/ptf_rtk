import { FC, useRef } from "react";
import styles from "./App.module.scss";
import classnames from "classnames/bind";
import { PopupManager } from "./components/Popups/PopupManager/PopupManager";
import { AppHeader } from "./components/AppHeader/AppHeader";
import { Main } from "./components/Main/Main";
import { TableRef } from "./components/DataTable/DataTable";
import useSideMenuReports from "./hook/useSideMenuReports";
import useApp from "./hook/useApp";

const cx: CX = classnames.bind(styles);
export const App: FC = () => {
  const { reportsArray, refetch } = useSideMenuReports();
  const dataTableRef = useRef<TableRef>(null);
  const { permissionAllowed } = useApp();

  return (
    <div className={cx("app")}>
      {permissionAllowed ? (
        <>
          <AppHeader dataTableRef={dataTableRef} />
          <Main dataTableRef={dataTableRef} reportsArray={reportsArray} />
          <PopupManager refetchReportsArray={refetch} />
        </>
      ) : (
        <div className={cx("is-loading")}>
          <span>No access</span>
        </div>
      )}
    </div>
  );
};
