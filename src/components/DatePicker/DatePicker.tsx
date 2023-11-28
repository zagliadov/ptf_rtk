import { convertLocalToUTCDate, convertUTCToLocalDate } from "src/utils";
import { ReactComponent as CalendarIcon } from "src/assets/icons/calendar-icon.svg";
import { ReactComponent as CaretLeft } from "src/assets/icons/caret-left-icon.svg";
import { ReactComponent as CaretRight } from "src/assets/icons/caret-right-icon.svg";
import "./DatePicker.global.scss";
import styles from "./DatePicker.module.scss";
import classnames from "classnames/bind";
import React from "react";
import ReactPicker, {
  ReactDatePickerCustomHeaderProps,
} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

const cx = classnames.bind(styles);

const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long" };
const intlInstance = new Intl.DateTimeFormat("en-US", options);

const CustomInput = React.forwardRef(
  (
    {
      error,
      ...attributes
    }: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean },
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <div className={cx("input")}>
        <label>
          <span className={cx("icon")}>
            <CalendarIcon color={"#4A7A8A"} />
          </span>
          <input
            ref={ref}
            type="text"
            {...attributes}
            className={cx({ error: error })}
          />
        </label>
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";

function Header({ date, onNextMonth, onPreviousMonth }: HeaderProps) {
  return (
    <div className={cx("header")}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onPreviousMonth();
        }}
        className={cx("month-control-icon", "month-control-icon-left")}
      >
        <CaretLeft />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onNextMonth();
        }}
        className={cx("month-control-icon", "month-control-icon-right")}
      >
        <CaretRight />
      </button>
      <span className={cx("current-date")}>{intlInstance.format(date)}</span>
    </div>
  );
}

function DatePicker({
  date,
  placeholder = "Select Date...",
  onChange,
  type,
  id,
  range = false,
  startDate,
  endDate,
  error,
  errors,
  message,
}: Props) {
  return (
    <div className={cx("date-picker")}>
      <ReactPicker
        renderCustomHeader={(params: ReactDatePickerCustomHeaderProps) => {
          return (
            <Header
              date={params.monthDate}
              onNextMonth={() => params.increaseMonth()}
              onPreviousMonth={() => params.decreaseMonth()}
            />
          );
        }}
        customInput={<CustomInput error={error} />}
        onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
          event.preventDefault();
        }}
        readOnly={false}
        allowSameDay={false}
        selected={convertUTCToLocalDate(startDate || date || null)}
        startDate={convertUTCToLocalDate(startDate || null)}
        endDate={convertUTCToLocalDate(endDate || null)}
        selectsRange={range}
        onChange={(date) => {
          Array.isArray(date)
            ? onChange([
                convertLocalToUTCDate(date[0]),
                convertLocalToUTCDate(date[1]),
              ])
            : onChange(convertLocalToUTCDate(date));
        }}
        dateFormat="dd MMM yyyy"
        placeholderText={placeholder}
        isClearable={false}
        showPopperArrow={false}
        className={cx({
          error: type === "error",
        })}
        id={id}
        calendarClassName={cx("calendar")}
        dayClassName={() => {
          return cx("day");
        }}
        wrapperClassName={cx("date-picker")}
      />
      {errors && <div className={cx("error-field")}>{message}</div>}
    </div>
  );
}

type Props = {
  date?: Date | null;
  startDate?: Date | null;
  endDate?: Date | null;
  onChange: (date: [Date | null, Date | null] | Date | null) => void;
  type?: "default" | "error";
  placeholder?: string;
  id?: string;
  range?: boolean;
  error?: boolean;
  errors?: boolean | string;
  message?: string | FieldError | any | Merge<FieldError, FieldErrorsImpl<any>>;
};

type HeaderProps = {
  date: Date;
  onNextMonth: () => void;
  onPreviousMonth: () => void;
};

export default DatePicker;