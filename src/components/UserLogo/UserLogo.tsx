import { FC, useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./UserLogo.module.scss";

const cx = classNames.bind(styles);

interface IProps {
  src: string;
  title: string;
}

const UserLogo: FC<IProps> = ({ src, title }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const image = new Image();
    image.src = src;
    image.onload = () => setImageLoaded(true);
    image.onerror = () => setError(true);
  }, [src]);

  const imgVisible = src && imageLoaded && !error;
  const displayTitle = title.trim() ? title : "?";

  return (
    <div className={cx("logo-wrapper", { "logo-error": !imgVisible })}>
      {imgVisible ? <img alt="logo" src={src} /> : <span>{displayTitle}</span>}
    </div>
  );
};

export default UserLogo;
