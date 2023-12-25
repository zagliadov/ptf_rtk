import { useMemo } from "react";
import classnames from "classnames/bind";
import ReactSelect, {
  ActionMeta,
  CSSObjectWithLabel,
  ClearIndicatorProps,
  ControlProps,
  DropdownIndicatorProps,
  GroupBase,
  MenuProps,
  MultiValue,
  MultiValueProps,
  OptionProps,
  SingleValue,
  StylesConfig,
  components,
} from "react-select";
import { COLOR } from "src/constants";
import { ReactComponent as ClearIcon } from "src/assets/icons/close-icon.svg";
import { MultipleCustomOption } from "./MultipleCustomOption/MultipleCustomOption";
import styles from "./Select.module.scss";
import * as _ from "lodash";

const cx: CX = classnames.bind(styles);

function BasicSelect<T extends Option & Record<string, unknown>>(
  props: Props<T>
) {
  const {
    options,
    isClearable = true,
    isMultiple = false,
    isOptionDisabled,
    value,
    label,
    Option,
    onChange,
    selectLabel,
    getLabel,
    placeholder,
    type,
    ...rest
  } = props;

  const isGroup = useMemo<boolean>(
    () =>
      _.some(
        options,
        (option: T | Group<T>) =>
          _.has(option, "options") && !_.isEmpty((option as Group<T>).options)
      ),
    [options]
  );

  const formattedOptions = useMemo(() => {
    // Deep clone the options to avoid mutating the original array.
    let result: (T | Group<T>)[] = _.cloneDeep(options);
    // If options are not grouped and multiple selection is allowed, add an 'All' option.
    if (!isGroup) {
      if (isMultiple) {
        const allOption: Option = { value: "all", label: `All ${label || ""}` };
        // Add 'All' option only if it's not already present.
        if (!_.some(result as T[], { value: "all" })) {
          result = [allOption as unknown as T, ...result];
        }
      }
    } else {
      // If options are grouped, process each group.
      result = _.map(options as Group<T>[], (group) => {
        const allOption: Option = {
          value: "all",
          label: `All ${group.label}`,
          groupKey: group.key,
        };
        // Combine 'All' option with the group's options, ensuring 'All' is not duplicated.
        const newOptions = _.concat(
          _.some(group.options, { value: "all" })
            ? []
            : [allOption as unknown as T],
          _.map(group.options, (option) => ({ ...option, groupKey: group.key }))
        );

        return { ...group, options: newOptions };
      });
    }
    // Limit the result to the first 100 items if it's an array.
    return _.isArray(result) ? _.slice(result, 0, 100) : result;
  }, [options, isGroup, isMultiple, label]);

  const filteredValue = useMemo(() => {
    if (isGroup) {
      // If options are grouped, filter out any items with 'halfSelected' property set to true.
      return _.filter(value as T[], (item: Option) => !item.halfSelected);
    }
    return value;
  }, [value, isGroup]);

  const allOptions = useMemo(() => {
    if (isGroup) {
      // If the options are grouped, create one flat array of options from all the groups.
      return _.flatMap(
        options as Group<T>[],
        (group: Group<T>) => group.options
      );
    } else {
      return options;
    }
  }, [isGroup, options]);

  const handleChange = (
    newValue: MultiValue<T> | SingleValue<T>,
    actionMeta: ActionMeta<T>
  ) => {
    let calculatedNewValue: T | T[] = newValue as T | T[];

    if (actionMeta.option?.value === "all") {
      const isSelected = (value as Option[]).length === allOptions.length;

      if (isSelected) calculatedNewValue = [];
      else calculatedNewValue = allOptions as T | T[];
    }
    onChange(calculatedNewValue, {
      action: actionMeta.action,
      option: actionMeta.option,
    });
  };

  return (
    <div className={cx("wrapper")}>
      <ReactSelect<T, typeof isMultiple, GroupBase<T>>
        {...rest}
        // menuIsOpen={true}
        classNamePrefix="select"
        isMulti={isMultiple}
        isClearable={isClearable}
        options={formattedOptions}
        onChange={handleChange}
        styles={getStyles(type === "error")}
        isSearchable={false}
        isOptionDisabled={isOptionDisabled}
        placeholder={placeholder}
        menuShouldScrollIntoView={false}
        components={{
          MultiValue: getMultiValue(getLabel),
          Option: getCustomOption(Option, value),
          Menu,
          IndicatorSeparator: () => null,
          ClearIndicator,
          DropdownIndicator,
        }}
        value={filteredValue as T | T[]}
        hideSelectedOptions={false}
        closeMenuOnSelect={!isMultiple}
        classNames={{
          control: () => cx("control"),
          valueContainer: () => cx("value-container"),
          input: () => cx("input"),
          placeholder: () => cx("placeholder"),
        }}
      />
    </div>
  );
}

function getMultiValue<T>(getLabel?: () => string) {
  return function MultiValueComponent(
    props: MultiValueProps<T, boolean, GroupBase<T>>
  ) {
    let label;
    if (getLabel) {
      label = getLabel();
    }
    if (props.getValue().length === 0 && !label)
      return <components.MultiValue {...props} />;
    if (props.getValue().length === 1)
      return <components.SingleValue {...props} />;
    return <span>{!props.index && label}</span>;
  };
}

export function getCustomOption<T extends Option>(
  Option: Props<T>["Option"],
  value: Option[] | Option | undefined | ""
) {
  return function CustomOption(
    optionProps: OptionProps<T, boolean, GroupBase<T>>
  ) {
    const {
      data: optionData,
      isSelected: isSelectedOption,
      options,
      getValue,
      isMulti,
    } = optionProps;
    let isSelected = isSelectedOption;
    let currentGroup: Group<T> | undefined;
    let halfSelected = false;
    const selectedOptions = getValue();

    if (optionData.groupKey) {
      currentGroup = _.find(options as Group<T>[], {
        key: optionData.groupKey,
      });
    }

    if (optionData.value === "all") {
      let currentOptions = currentGroup
        ? currentGroup.options
        : (options as T[]);

      isSelected = _.every(currentOptions, (item: T) => {
        return (
          item.value !== optionData.value &&
          _.some(selectedOptions, { value: item.value })
        );
      });

      halfSelected = _.some(currentOptions, (item: T) => {
        return (
          item.value !== optionData.value &&
          _.some(selectedOptions, { value: item.value })
        );
      });
    }

    if (Option) {
      if (isMulti) {
        const data = _.find(value as Option[], { value: optionData.value });
        return (
          <MultipleCustomOption
            onSelect={() => {
              optionProps.selectOption(optionProps.data);
            }}
            isSelected={isSelected}
            halfSelected={data?.halfSelected || halfSelected}
          >
            <Option
              isSelected={isSelected}
              value={optionData}
              groupKey={currentGroup?.key}
            />
          </MultipleCustomOption>
        );
      }
      return (
        <div
          tabIndex={0}
          role="button"
          onClick={() => {
            optionProps.selectOption(optionProps.data);
          }}
        >
          <Option
            isSelected={optionProps.isSelected}
            value={optionProps.data}
          />
        </div>
      );
    }

    if (isMulti) {
      const data = _.find(value as Option[], { value: optionData.value });

      return (
        <MultipleCustomOption
          onSelect={() => {
            optionProps.selectOption(optionProps.data);
          }}
          isSelected={isSelected}
          halfSelected={data?.halfSelected || halfSelected}
        >
          <span>{optionData.label}</span>
        </MultipleCustomOption>
      );
    }

    return <components.Option {...optionProps} />;
  };
}

function ClearIndicator<T>(
  clearIndicatorProps: ClearIndicatorProps<T, boolean, GroupBase<T>>
) {
  return (
    <components.ClearIndicator {...clearIndicatorProps}>
      {clearIndicatorProps.children}
      <button className={cx("clear-button")} type="button">
        <ClearIcon color={COLOR["blue-dark"]} />
      </button>
    </components.ClearIndicator>
  );
}

export function DropdownIndicator<T>(
  dropdownIndicatorProps: DropdownIndicatorProps<T, boolean, GroupBase<T>>
) {
  return (
    <svg
      style={{
        transform: dropdownIndicatorProps.selectProps.menuIsOpen
          ? "rotate(180deg)"
          : "rotate(0)",
        transitionProperty: "all",
        transitionDuration: ".15s",
        transitionTimingFunction: "ease-in-out",
        marginRight: "1rem",
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
  );
}

export function getStyles<T>(
  error: boolean
): StylesConfig<T, boolean, GroupBase<T>> {
  return {
    control: (
      baseStyles: CSSObjectWithLabel,
      state: ControlProps<T, boolean, GroupBase<T>>
    ) => ({
      ...baseStyles,
      borderColor: error
        ? "#DF715F !important"
        : state.isFocused
        ? "#ADB4BD"
        : "#D9DDE2",
      outline: "none",
      borderRadius: "8px",
      fontSize: "14px",
      boxShadow: state.isFocused ? "none" : "none",
      height: "40px",
      zIndex: 11,
      paddingLeft: "calc(0.5rem - 1px)",

      "&:hover": {
        borderColor: error
          ? "#DF715F"
          : state.isFocused
          ? "#ADB4BD"
          : "#D9DDE2",
        boxShadow: state.isFocused ? "none" : "none",
      },
    }) as CSSObjectWithLabel,
    placeholder: (base: CSSObjectWithLabel) => ({
      ...base,
      color: "#ADB4BD",
      fontWeight: 400,
      whiteSpace: "nowrap",
    }) as CSSObjectWithLabel,
    groupHeading: (base: CSSObjectWithLabel) => ({
      ...base,
      textTransform: "none",
      fontSize: "14px",
      fontWeight: "700",
      lineHeight: "20px",
      color: "#454A54",
      paddingLeft: "6px",
      marginBottom: "0px",
    }) as CSSObjectWithLabel,
    menuList: (base: CSSObjectWithLabel) => ({
      ...base,
      marginTop: 0,
      borderRadius: "8px",
      border: "1px solid #ADB4BD",
      boxShadow: "none",
      transition: "all .2s cubic-bezier(.5,0,0,1.25),opacity .15s ease-out",
      transformOrigin: "50% 0",
    }) as CSSObjectWithLabel,
    menu: (base: CSSObjectWithLabel) => {
      return {
        ...base,
        background: "#fff",
        marginTop: "-2px",
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        zIndex: 20,
        width: "auto",
        minWidth: "100%",
        borderBottomLeftRadius: "8px",
        borderBottomRightRadius: "8px",
        borderColor: "#ADB4BD!important",
        boxShadow: "none",
        border: "none",
      } as any;
    },
    option: (
      base: CSSObjectWithLabel,
      {
        isDisabled,
        isSelected,
      }: {
        isDisabled: boolean;
        isSelected: boolean;
      }
    ) => {
      return {
        ...base,
        backgroundColor: "#fff",
        padding: "12px",
        color: isSelected ? "#202020" : "#ADB4BD",
        cursor: isDisabled ? "not-allowed" : "default",
        "&:active": {
          background: "#fff",
        },
        "&:hover": {
          color: "#202020",
        },
      } as CSSObjectWithLabel;
    },
    valueContainer: (base: CSSObjectWithLabel) => ({
      ...base,
      input: { height: 0 },
      whiteSpace: "nowrap",
    }) as CSSObjectWithLabel,
  };
}

function Menu<T>({ children, ...rest }: MenuProps<T, boolean, GroupBase<T>>) {
  return (
    <components.Menu className={cx("menu")} {...rest}>
      {children}
    </components.Menu>
  );
}

export type Option = {
  value: string;
  label: string;
  groupKey?: string;
  halfSelected?: boolean;
};

export type Group<T extends Record<string, unknown>> = {
  options: T[];
  label: string;
  key?: string;
};

export type ChangeAction<T> = {
  option: T | undefined;
  action: ActionMeta<T>["action"];
};

export type Props<T extends Option & Record<string, unknown>> = {
  value: Option | Option[] | undefined | "";
  onChange: (value: T | T[] | null, action: ChangeAction<T>) => void;
  options: T[] | Group<T>[];
  isClearable?: boolean;
  placeholder?: string;
  isMultiple?: boolean;
  isOptionDisabled?: (option: T) => boolean;
  label?: string;
  selectLabel?: string;
  getLabel?: () => string;
  Option?: (props: {
    value: T;
    isSelected?: boolean;
    groupKey?: string;
  }) => JSX.Element;
  type?: "error" | "default";
};

export default BasicSelect;
