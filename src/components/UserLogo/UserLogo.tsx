import { FC, useState } from "react";
import classNames from "classnames/bind";
import styles from "./UserLogo.module.scss";

const cx: CX = classNames.bind(styles);

interface IProps {
  src: string;
  title: string;
}
export const UserLogo: FC<IProps> = ({ src, title }) => {
  const [error, setError] = useState(false);
  const imgVisible = src && !error;
  return (
    <div className={cx("logo-wrapper", { "logo-error": !imgVisible })}>
      {imgVisible && (
        <img alt="logo" src={src} onError={() => setError(true)} />
      )}
      {!imgVisible && (title.trim() ? title : "?")}
    </div>
  );
};
