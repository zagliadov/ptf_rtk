import { FC, useCallback, useEffect } from "react";
import styles from "./CreateCopyReport.module.scss";
import classnames from "classnames/bind";
import { RootState, useAppDispatch, useAppSelector } from "src/store/store";
import { useFormContext } from "react-hook-form";
import { EDataKeys, RData } from "src/types";
import { useHoverPositionVisibility } from "src/hook/useHoverPositionVisibility";
import Select from "src/components/Select";
import { UniPopup } from "../UniPopup/UniPopup";
import { ButtonWrapper } from "src/components/ButtonWrapper/ButtonWrapper";
import { Button } from "src/components/Button/Button";
import { ToggleButton } from "src/components/ToggleButton/ToggleButton";
import Input from "src/components/Input";
import { PopupHeader } from "../PopupHeader/PopupHeader";
import {
  setCreateCopyReportOpen,
  setIsCreateReport,
  setIsFiltersOpen,
  setIsUnsavedChanges,
} from "src/store/managerSlice";
import ReactDOM from "react-dom";
import * as _ from "lodash";
import { createReport, setIsReportCreated } from "src/store/reportSlice";
import { setSelectedFilters } from "src/store/filtersSlice";

const cx: CX = classnames.bind(styles);

interface IOptions {
  label: string;
  value: string;
}
const options: IOptions[] = [
  { label: "Sites", value: "Site" },
  { label: "Projects", value: "Project" },
  { label: "Travel Requests", value: "Travel%20Request" },
  { label: "Tickets", value: "Ticket" },
];

interface IProps {
  onContinue: () => void;
  refetchReportsArray: any;
}

export const CreateCopyReport: FC<IProps> = ({
  onContinue,
  refetchReportsArray,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    reset,
    formState: { errors },
  } = useFormContext<RData>();
  const dispatch = useAppDispatch();
  const { reportName, reportSourceId, reportType, reportFilters } =
    useAppSelector((state: RootState) => state.report);
  const {
    isVisible: isInfoVisible,
    position: infoPosition,
    handleMouseEnter: handleInfoMouseEnter,
    handleMouseLeave: handleInfoMouseLeave,
  } = useHoverPositionVisibility({});

  const onSubmit = useCallback(
    async (data: RData) => {
      if (reportName !== data[EDataKeys.REPORT_TITLE]) {
        const reportsArray = await refetchReportsArray();
        const isDuplicateName = _.some(reportsArray.data, {
          name: data[EDataKeys.REPORT_TITLE],
        });
        if (isDuplicateName) {
          setError(EDataKeys.REPORT_TITLE, {
            type: "manual",
            message: "Such report already exists, please use another name",
          });
          return;
        }
      }

      const columnIds = _.map(reportFilters, (item) => item.id);
      const updateReportFilters = _.map(reportFilters, (item, index) => ({ ...item, position: index }));
      setValue(EDataKeys.FILTERED_LIST, updateReportFilters);
      setValue(EDataKeys.COLUMN_IDS, columnIds);
      if (_.isEmpty(data[EDataKeys.FILTERED_LIST])) return;
      dispatch(setIsCreateReport(true));
      await dispatch(createReport({ data, update: false }))
        .then(() => {
          dispatch(setSelectedFilters(data[EDataKeys.FILTERED_LIST]));
          dispatch(setCreateCopyReportOpen(false));
          reset();
        })
        .then(() => {
          dispatch(setIsReportCreated(false));
          dispatch(setIsCreateReport(false));
        });
      // onContinue();
    },
    [onContinue, refetchReportsArray, reportName, setError]
  );

  const onCancel = useCallback(() => {
    if (
      watch(EDataKeys.REPORT_TITLE) !== `${reportName} (Copy)` ||
      watch(EDataKeys.REPORT_TYPE) !== reportType
    ) {
      dispatch(setIsUnsavedChanges(true));
    } else {
      dispatch(setCreateCopyReportOpen(false));
      reset();
    }
  }, [dispatch, reportName, reportType, reset, watch]);

  const onToggleChange = useCallback(
    (newValue: EDataKeys.INTERNAL | EDataKeys.EXTERNAL) => {
      setValue(EDataKeys.REPORT_TYPE, newValue);
    },
    [setValue]
  );

  useEffect(() => {
    if (!watch(EDataKeys.REPORT_TITLE)) {
      setValue(EDataKeys.REPORT_TITLE, `${reportName} (Copy)`);
    }
    if (!watch(EDataKeys.DATA_SOURCE)) {
      setValue(EDataKeys.DATA_SOURCE, reportSourceId);
    }
    if (!watch(EDataKeys.REPORT_TYPE)) {
      if (reportType !== null) {
        setValue(EDataKeys.REPORT_TYPE, reportType);
      }
    }
  }, [reportName, reportSourceId, reportType, setValue, watch]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={cx("create-copy-report")}>
        <PopupHeader title={`Create New Report from Copy`} onClose={onCancel} />
        <div className={cx("popup-body")}>
          <Input
            {...register(EDataKeys.REPORT_TITLE)}
            name={EDataKeys.REPORT_TITLE}
            placeholder={EDataKeys.REPORT_TITLE}
            error={errors[EDataKeys.REPORT_TITLE]?.message}
          />
          <div
            onMouseEnter={handleInfoMouseEnter}
            onMouseLeave={handleInfoMouseLeave}
          >
            <Select
              options={options}
              value={watch(EDataKeys.DATA_SOURCE)}
              placeholder={EDataKeys.DATA_SOURCE}
              error={errors[EDataKeys.DATA_SOURCE]?.message}
              disabled={true}
              onChange={function (value: string | null): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>

          <ToggleButton
            value={watch(EDataKeys.REPORT_TYPE)}
            onChange={onToggleChange}
            error={errors[EDataKeys.REPORT_TYPE]?.message}
          />
          <ButtonWrapper shift={"right"}>
            <Button
              primary
              type="submit"
              title="Save"
              style={{ width: "134px" }}
            />
            <Button
              title="Cancel"
              onClick={onCancel}
              style={{ width: "76px", marginLeft: "16px" }}
            />
          </ButtonWrapper>
        </div>
      </div>
      {isInfoVisible &&
        ReactDOM.createPortal(
          <UniPopup
            position={infoPosition}
            description={
              "You can't change Data Source for the existing report."
            }
            top={45}
            left={300}
            customStyle={{
              width: "auto",
              borderTopRightRadius: "8px",
              borderBottomRightRadius: "8px",
              borderBottomLeftRadius: "8px",
            }}
          />,
          document.body
        )}
    </form>
  );
};
