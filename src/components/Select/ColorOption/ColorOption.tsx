import { OptionProps, components } from "react-select";
import { Colorization } from "src/types";
import styles from "./ColorOption.module.scss";
import classnames from "classnames/bind";

interface ColorOptionProps
  extends OptionProps<
    { value: string; label: string; colorization?: Colorization[] },
    false
  > {}

const cx: CX = classnames.bind(styles);

export const ColorOption = (props: ColorOptionProps) => {
  const colorization: Colorization[] | undefined = props?.data?.colorization;
  let color: string | undefined = colorization?.find(
    (c: Colorization) => c.pattern && props.label.includes(c.pattern)
  )?.color;

  if (!color) {
    color =
      colorization?.find((c: Colorization) => !c.pattern)?.color ||
      "transparent";
  }

  return (
    <components.Option {...props}>
      <div className={cx("options-wrapper")}>
        {colorization && (
          <div
            className={cx("options-colorization")}
            style={{
              backgroundColor: color,
            }}
          ></div>
        )}
        <span className={cx("options-label")}>{props.label}</span>
      </div>
    </components.Option>
  );
};
