import { CSSProperties, FC, ReactNode } from "react";
import classNames from "classnames/bind";
import styles from "./MultipleCustomOption.module.scss";
import BasicCheckbox from "src/components/BasicCheckbox/BasicCheckbox";

const cx: CX = classNames.bind(styles);

interface IProps {
  onSelect: () => void;
  isSelected: boolean;
  halfSelected?: boolean;
  style?: CSSProperties;
  children: ReactNode;
}
export const MultipleCustomOption: FC<IProps> = ({
  children,
  onSelect,
  isSelected,
  halfSelected = false,
  style = {},
}) => {
  const checked = isSelected || halfSelected;

  return (
    <div
      className={cx("wrapper", {
        selected: isSelected,
      })}
      onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();

        onSelect();
      }}
      style={style}
      role="button"
      tabIndex={0}
    >
      <BasicCheckbox
        className={cx("checkbox", {
          "half-selected": halfSelected && !isSelected,
        })}
        checked={checked}
        onChange={() => null}
        renderLabel={() => null}
      />
      {children}
    </div>
  );
};
