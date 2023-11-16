import { FC } from "react";
import styles from "./DotSpinner.module.scss";
import classnames from "classnames/bind";

const cx = classnames.bind(styles);

export const DotSpinner: FC = () => {
  return (
    <div className={cx("dot-spinner")}>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((dot: number) => {
        return <div key={dot} className={cx("dot")} />;
      })}
    </div>
  );
}