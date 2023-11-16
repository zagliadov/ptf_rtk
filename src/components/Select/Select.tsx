import { ForwardedRef, forwardRef } from "react";
import ReactSelect, {
  ActionMeta,
  CSSObjectWithLabel,
  ControlProps,
  DropdownIndicatorProps,
  SingleValue,
  components,
} from "react-select";
import classnames from "classnames/bind";

import styles from "./Select.module.scss";
import { ReactComponent as CloseIcon } from "src/assets/icons/close-icon.svg";

const cx: CX = classnames.bind(styles);

const Select = forwardRef(
  (props: Props, ref: ForwardedRef<HTMLSelectElement>) => {
    const { error, options, onChange, value, isClearable = false, ...rest } = props;

    const handleChange = (
      selectedOption: SingleValue<{ value: string; label: string; }>,
      actionMeta: ActionMeta<{ value: string; label: string; }>
    ) => {
      if (actionMeta.action === "select-option" || actionMeta.action === "clear") {
        onChange(selectedOption ? selectedOption.value : null);
      }
    };

    return (
      <div className={cx("wrapper")}>
        <ReactSelect
          {...rest}
          isClearable={isClearable}
          options={options}
          styles={{
            control: (
              baseStyles: CSSObjectWithLabel,
              state: ControlProps<{ value: string; label: string }>
            ) => ({
              ...baseStyles,
              borderColor: error
                ? "#DF715F"
                : state.isFocused
                ? "#ADB4BD"
                : "#D9DDE2",
              outline: "none",
              borderRadius: "8px",
              fontSize: "14px",
              boxShadow: state.isFocused ? "none" : "none",
              height: "40px",
              "&:hover": {
                borderColor: error
                  ? "#DF715F"
                  : state.isFocused
                  ? "#ADB4BD"
                  : "#D9DDE2",
                boxShadow: state.isFocused ? "none" : "none",
              },
            }),
            valueContainer: (base: CSSObjectWithLabel) => ({
              ...base,
              paddingLeft: "16px",
              paddingRight: 0,
            }),
            placeholder: (base: CSSObjectWithLabel) => ({
              ...base,
              fontSize: "14",
              color: "#ADB4BD",
              fontWeight: 400,
              whiteSpace: "nowrap",
              margin: 0,
            }),
            menuList: (base: CSSObjectWithLabel) => ({
              ...base,
              marginTop: 0,
              borderBottomLeftRadius: "8px",
              borderBottomRightRadius: "8px",
              borderRadius: "8px",
              border: "1px solid #ADB4BD",
              boxShadow: "none",
              transition:
                "all .2s cubic-bezier(.5,0,0,1.25),opacity .15s ease-out",
              transformOrigin: "50% 0",
            }),
            menu: (base: CSSObjectWithLabel) => {
              return {
                ...base,
                background: "#fff",
                marginTop: "4px",
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                zIndex: 10,
                borderBottomLeftRadius: "8px",
                borderBottomRightRadius: "8px",
                borderColor: "#ADB4BD!important",
                boxShadow: "none",
                border: "none",
              };
            },
            option: (
              base: CSSObjectWithLabel,
              {
                isDisabled,
                isSelected,
              }: { isDisabled: boolean; isSelected: boolean }
            ) => {
              return {
                ...base,
                backgroundColor: "#fff",
                padding: "12px",
                fontSize: "0.875rem",
                color: isSelected ? "#202020" : "#ADB4BD",
                cursor: isDisabled ? "not-allowed" : "default",
                "&:active": {
                  background: "#fff",
                },
                "&:hover": {
                  color: "#202020",
                },
              };
            },
          }}
          isSearchable={false}
          components={{
            Menu: (menuProps) => (
              <components.Menu {...menuProps} className={cx("menu")} />
            ),
            IndicatorSeparator: () => null,
            ClearIndicator: ({ ...clearIndicatorProps }) => (
              <components.ClearIndicator {...clearIndicatorProps}>
                {clearIndicatorProps.children}
                <div style={{ stroke: "#4a7a8a", cursor: "pointer" }}>
                  <CloseIcon />
                </div>
              </components.ClearIndicator>
            ),
            DropdownIndicator: (
              dropdownIndicatorProps: DropdownIndicatorProps | any
            ) => (
              <svg
                style={{
                  transform: dropdownIndicatorProps.selectProps.menuIsOpen
                    ? "rotate(180deg)"
                    : "rotate(0)",
                  transitionProperty: "all",
                  transitionDuration: ".15s",
                  transitionTimingFunction: "ease-in-out",
                  marginRight: "12px",
                }}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <g id="CaretDown" clipPath="url(#clip0_150_3041)">
                  <path
                    id="Vector"
                    d="M13 6L8 11L3 6"
                    stroke="#4A7A8A"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_150_3041">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            ),
          }}
          value={options.find((option) => option.value === value)}
          ref={ref as any}
          onChange={handleChange as any}
        />
        {error && <div className={cx("error")}>{error}</div>}
      </div>
    );
  }
);

Select.displayName = "Select";

type Props = {
  value: string | null;
  onChange: (value: string | null) => void;
  onBlur?: () => void;
  options: { value: string; label: string }[];
  isClearable?: boolean;
  placeholder?: string;
  error?: string;
};

export default Select;
