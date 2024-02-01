import {
  useState,
  FC,
  useEffect,
  ChangeEvent,
  useMemo,
  useCallback,
} from "react";
import classNames from "classnames/bind";
import styles from "./MUSelect.module.scss";
import ReactDOM from "react-dom";
import { useHoverPositionVisibility } from "src/hook/useHoverPositionVisibility";
import { MUOption } from "./MUOption";
import { ReactComponent as CloseIcon } from "src/assets/icons/close-icon.svg";
import { ReactComponent as CaretBottomIcon } from "src/assets/icons/caret-down-icon.svg";
import { RootState, useAppDispatch, useAppSelector } from "src/store/store";
import * as _ from "lodash";
import { confirmFilterChanges } from "src/store/managerSlice";
import { setFilterChoice, setUserInteracted } from "src/store/filtersSlice";

const cx = classNames.bind(styles);

interface IProps {
  item: any;
  updateFilters?: (id: number, value: any) => void;
  handleSelectChange?: any;
  top?: number;
  right?: number;
  width?: string;
  extractData?: any;
  isAppliedFiltersOverview?: boolean;
}
export const MUSelect: FC<IProps> = ({
  item: { name, choice, id },
  handleSelectChange,
  updateFilters,
  top,
  right,
  width,
  extractData,
  isAppliedFiltersOverview = false,
}) => {
  const { isVisible, position, handleMouseClick, handleMouseLeave } =
    useHoverPositionVisibility({});
  const { reportName } = useAppSelector((state: RootState) => state.report);
  const [checkboxState, setCheckboxState] = useState<any>(extractData);
  const [filteredState, setFilteredState] = useState<any>();
  const [searchValue, setSearchValue] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isShowAll, setIsShowAll] = useState<boolean>(false);
  const [isAllCheckbox, setIsAllCheckbox] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { userInteracted } = useAppSelector(
    (state: RootState) => state.filters
  );
  const { isEditFiltersOpen } = useAppSelector(
    (state: RootState) => state.manager
  );

  useEffect(() => {
    setSearchValue("");
    dispatch(setUserInteracted(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportName]);

  const trueKeys = useMemo(() => {
    return _.keys(_.pickBy(checkboxState, (value) => value === true));
  }, [checkboxState]);

  const toggleCheckbox = useCallback(
    (key: string) => {
      dispatch(setUserInteracted(true));
      setCheckboxState((prevState: any) => ({
        ...prevState,
        [key]: !prevState[key],
      }));
      setFilteredState((prevState: any) => ({
        ...prevState,
        [key]: !prevState[key],
      }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setCheckboxState, setFilteredState]
  );

  useEffect(() => {
    setIsInitialized(true);
  }, []);
  useEffect(() => {
    if (
      isInitialized &&
      userInteracted &&
      isAppliedFiltersOverview &&
      !isEditFiltersOpen
    ) {
      try {
        const choiceItem = JSON.parse(choice);
        if (!_.isEmpty(choiceItem) || choiceItem !== "[]") {
          const difference1 = _.difference(choiceItem, trueKeys);
          const difference2 = _.difference(trueKeys, choiceItem);
          if (!_.isEmpty(difference1) || !_.isEmpty(difference2)) {
            if (!isVisible) {
              setIsShowAll(false);
              console.log(
                "Some choiceItem elements are missing from trueKeys:",
                difference1
              );
              dispatch(confirmFilterChanges(true));
              dispatch(
                setFilterChoice({
                  choice: trueKeys,
                  filterName: name,
                  reportName,
                })
              );
            }
          }
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isAllCheckbox,
    trueKeys,
    isVisible,
    dispatch,
    name,
    choice,
    isInitialized,
    reportName,
    userInteracted,
    isAppliedFiltersOverview,
    checkboxState,
  ]);

  useEffect(() => {
    updateFilters && updateFilters(id, trueKeys);
    handleSelectChange && handleSelectChange(trueKeys, name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trueKeys]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    const filteredState = _.pickBy(checkboxState, (val, key) =>
      _.includes(key.toLowerCase(), value.toLowerCase())
    );
    setFilteredState(filteredState);
  };

  const handleShowOnlySelected = useCallback(() => {
    let trueValuesObject = _.pickBy(checkboxState, (value) => value === true);
    if (_.isEmpty(trueValuesObject)) return;
    if (_.size(trueValuesObject) === _.size(checkboxState)) return;
    setIsShowAll(!isShowAll);
    if (isShowAll) setFilteredState(checkboxState);
    if (!isShowAll) setFilteredState(trueValuesObject);
  }, [checkboxState, isShowAll]);

  const updatedCheckboxState = useMemo(() => {
    if (!choice) return {};
    try {
      const choiceItem = JSON.parse(choice);
      if (
        Array.isArray(choiceItem) &&
        !_.isEmpty(choiceItem) &&
        !_.isEmpty(extractData)
      ) {
        return _.mapValues(extractData, (val, key) => choiceItem.includes(key));
      }
    } catch (e) {
      console.error("Error parsing JSON:", e);
      return {};
    }

    return {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choice, reportName]);

  useEffect(() => {
    if (!_.isEmpty(updatedCheckboxState)) {
      setCheckboxState(updatedCheckboxState);
      setFilteredState(updatedCheckboxState);
    } else {
      if (isAppliedFiltersOverview) {
        setCheckboxState(extractData);
        setFilteredState(extractData);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedCheckboxState]);

  const handleClear = (e: any) => {
    handleSelectChange && handleSelectChange("", name);
    updateFilters && updateFilters(id, "");
    setSearchValue("");
    setCheckboxState(extractData);
    setFilteredState(extractData);
    if (isAppliedFiltersOverview) {
      e.stopPropagation();
      dispatch(confirmFilterChanges(true));
      dispatch(setFilterChoice({ choice: [], filterName: name, reportName }));
    }
  };

  const handleOptions = (e: any) => {
    handleMouseClick(e);
  };

  const getTrueKeysJoined = (obj: any) => {
    const trueKeys = _.keys(_.pickBy(obj, (value) => value === true));
    return _.join(trueKeys, ", ");
  };

  const getTrueKeysCount = (obj: any) => {
    const trueKeys = _.filter(_.keys(obj), (key) => obj[key] === true);
    return trueKeys.length;
  };

  const toggleAllCheckbox = () => {
    setIsAllCheckbox(!isAllCheckbox);
    if (!isAllCheckbox) {
      const allChecked = _.mapValues(filteredState, () => true);
      setFilteredState(allChecked);
      setCheckboxState(allChecked);
    } else {
      const allChecked = _.mapValues(filteredState, () => false);
      setFilteredState(allChecked);
      setCheckboxState(allChecked);
    }
  };

  useEffect(() => {
    const everyTrue = _.every(filteredState, (value) => value === true);
    if (everyTrue) {
      setIsAllCheckbox(true);
    } else {
      setIsAllCheckbox(false);
    }
  }, [filteredState, isAllCheckbox]);

  const trueKeysCount = getTrueKeysCount(filteredState);
  const trueKeysJoined = getTrueKeysJoined(filteredState);

  return (
    <div className={cx("mu-select")} onMouseLeave={handleMouseLeave}>
      <div
        className={cx("input-wrapper", isVisible && "active")}
        onClick={handleOptions}
      >
        <div className={cx("search-value-wrapper")}>
          {trueKeysJoined ? (
            <span>{trueKeysJoined}</span>
          ) : (
            <span className={cx("pseudo-placeholder")}>{`Select ${name}`}</span>
          )}
        </div>
        <div className={cx("control-wrapper")}>
          <span>{`${trueKeysCount > 0 ? `(${trueKeysCount})` : ""}`}</span>
          <div className={cx("mu-select-close-icon")}>
            {trueKeysCount > 0 && <CloseIcon onClick={handleClear} />}
          </div>
          <div className={cx("mu-select-drop-icon")}>
            {isVisible ? (
              <CaretBottomIcon style={{ transition: "0.2s" }} />
            ) : (
              <CaretBottomIcon
                style={{ transform: "rotate(180deg)", transition: "0.2s" }}
              />
            )}
          </div>
        </div>
      </div>
      {isVisible &&
        ReactDOM.createPortal(
          <MUOption
            position={position}
            toggleCheckbox={toggleCheckbox}
            handleSearchChange={handleSearchChange}
            handleShowOnlySelected={handleShowOnlySelected}
            searchValue={searchValue}
            checkboxState={filteredState}
            isVisible={isVisible}
            top={top}
            right={right}
            width={width}
            name={name}
            id={id}
            extractData={extractData}
            setFilteredState={setFilteredState}
            isShowAll={isShowAll}
            isAllCheckbox={isAllCheckbox}
            toggleAllCheckbox={toggleAllCheckbox}
          />,
          document.body
        )}
    </div>
  );
};
