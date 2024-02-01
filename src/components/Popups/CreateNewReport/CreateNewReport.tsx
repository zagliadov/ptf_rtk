import { FC, useCallback, useEffect, useState } from "react";
import styles from "./CreateNewReport.module.scss";
import classnames from "classnames/bind";
import { PopupHeader } from "../PopupHeader/PopupHeader";
import Input from "src/components/Input";
import Select from "src/components/Select";
import { ToggleButton } from "src/components/ToggleButton/ToggleButton";
import { Button } from "src/components/Button/Button";
import { ButtonWrapper } from "src/components/ButtonWrapper/ButtonWrapper";
import { useFormContext } from "react-hook-form";
import { EDataKeys, RData } from "src/types";
import { useAppDispatch } from "src/store/store";
import { setCreateNewReportOpen } from "src/store/managerSlice";
import * as _ from "lodash";

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
export const CreateNewReport: FC<IProps> = ({
  onContinue,
  refetchReportsArray,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    unregister,
    watch,
    clearErrors,
    reset,
    formState: { errors },
  } = useFormContext<RData>();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>("Loading");

  const updateLoadingText = useCallback(() => {
    setLoadingText(prev => {
      const dots = prev?.replace("Loading", "");
      return dots.length < 3 ? prev + "." : "Loading";
    });
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(updateLoadingText, 300);
    }
    return () => clearInterval(interval);
  }, [isLoading, updateLoadingText]);

  const onPrimaryChange = useCallback(
    (newValue: string | null): void => {
      if (newValue) {
        setValue(EDataKeys.DATA_SOURCE, newValue);
        clearErrors(EDataKeys.DATA_SOURCE);
        unregister(EDataKeys.FILTERS);
        unregister(EDataKeys.FILTERED_LIST);
      }
    },
    [clearErrors, setValue, unregister]
  );

  const onSubmit = useCallback(
    async (data: RData) => {
      setIsLoading(true);
      const reportsArray = await refetchReportsArray();
      const isDuplicateName = _.some(reportsArray.data, {
        name: data[EDataKeys.REPORT_TITLE],
      });
      if (isDuplicateName) {
        setError(EDataKeys.REPORT_TITLE, {
          type: "manual",
          message: "Such report already exists, please use another name"
        });
      }
      if (!isDuplicateName) {
        setIsLoading(false);
        onContinue();
      }
    },
    [onContinue, refetchReportsArray, setError]
  );

  const onCancel = useCallback(() => {
    dispatch(setCreateNewReportOpen(false));
    reset();
  }, [dispatch, reset]);

  const onToggleChange = useCallback(
    (newValue: EDataKeys.INTERNAL | EDataKeys.EXTERNAL) => {
      setValue(EDataKeys.REPORT_TYPE, newValue);
    },
    [setValue]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={cx("create-new-report")}>
        <PopupHeader title={"Create New Report"} onClose={onCancel} />
        <div className={cx("popup-body")}>
          <Input
            {...register(EDataKeys.REPORT_TITLE)}
            name={EDataKeys.REPORT_TITLE}
            placeholder={EDataKeys.REPORT_TITLE}
            error={errors[EDataKeys.REPORT_TITLE]?.message}
          />
          <Select
            options={options}
            value={watch(EDataKeys.DATA_SOURCE)}
            onChange={onPrimaryChange}
            placeholder={EDataKeys.DATA_SOURCE}
            error={errors[EDataKeys.DATA_SOURCE]?.message}
          />

          <ToggleButton
            value={watch(EDataKeys.REPORT_TYPE)}
            onChange={onToggleChange}
            error={errors[EDataKeys.REPORT_TYPE]?.message}
          />
          <ButtonWrapper shift={"right"}>
            <Button
              primary
              type="submit"
              title={isLoading ? loadingText : "Continue"}
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
    </form>
  );
};
