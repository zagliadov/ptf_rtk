import styles from "./Textarea.module.scss";
import classnames from "classnames/bind";
import { ForwardedRef, forwardRef } from "react";
import { IIFilters } from "src/types";

const cx: CX = classnames.bind(styles);

const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  (props: Props, ref: ForwardedRef<HTMLTextAreaElement>) => {
    const { item, ...rest } = props;

    return (
      <div className={cx("wrapper")}>
        <textarea
          ref={ref}
          style={{ cursor: "default" }}
          {...rest}
          data-simplebar
          placeholder="Add text"
        />
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

type Props = React.HTMLProps<HTMLTextAreaElement> & {
  item: IIFilters;
};

export default Textarea;
