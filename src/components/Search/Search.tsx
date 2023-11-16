import { useEffect, useState } from "react";
import classNames from "classnames/bind";

import styles from "./Search.module.scss";
import { ReactComponent as CloseIcon } from "src/assets/icons/close-icon.svg";
import { ReactComponent as SearchIcon } from "src/assets/icons/search-icon.svg";

const cx = classNames.bind(styles);

interface ISearchProps {
  value: string;
  onChange: (value: string) => void;
  onReset?: () => void;
  disabled?: boolean;
  placeholder: string;
  width: string;
}

const Search = ({ value, onChange, onReset, disabled, placeholder, width }: ISearchProps) => {
  const [option, setOption] = useState(value || "");

  const handleInputState = (setState: (string: string) => void) => (e: any) => {
    if (e.target) {
      setState((e.target as HTMLInputElement).value);
      onChange((e.target as HTMLInputElement).value);
    }
  };

  const handleReset = () => {
    if(disabled) return;
    setOption("");
    onChange("");
    if (onReset) onReset();
  };

  useEffect(() => {
    setOption(value);
  }, [value])

  return (
    <div className={cx("box")}>
      {option.length > 0 && (
        <button className={cx("reset")} onClick={handleReset}>
          <CloseIcon />
        </button>
      )}
      <div className={cx("icon")}>
        <SearchIcon />
      </div>
      <input
        style={{ width: width }}
        type="text"
        value={option}
        onChange={handleInputState(setOption)}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};

export default Search;