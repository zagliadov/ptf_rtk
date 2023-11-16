import { FC } from "react";
import styles from "./CreateNewReport.module.scss";
import classnames from "classnames/bind";
import { PopupHeader } from "../PopupHeader/PopupHeader";
import Input from "src/components/Input";
import Select from "src/components/Select";
import { ToggleButton } from "src/components/ToggleButton/ToggleButton";
import { Button } from "src/components/Button/Button";
import { ButtonWrapper } from "src/components/ButtonWrapper/ButtonWrapper";
import { useAppDispatch } from "src/store/store";
import { setCreateNewReportOpen } from "src/store/managerSlice";
import { useFormContext } from "react-hook-form";
import { EDataKeys, RData } from "src/types";

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
}
export const CreateNewReport: FC<IProps> = ({ onContinue }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useFormContext<RData>();
  const dispatch = useAppDispatch();
  const onPrimaryChange = (newValue: string | null): void => {
    if (newValue) {
      setValue(EDataKeys.DATA_SOURCE, newValue);
    }
  };

  const onSubmit = (data: RData) => {
    console.log("Form Data:", data);
    onContinue();
  };

  const onCancel = () => {
    dispatch(setCreateNewReportOpen(false));
  };

  const onToggleChange = (newValue: string) => {
    setValue(EDataKeys.REPORT_TYPE, newValue);
  };

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
          />
          <ToggleButton
            value={watch(EDataKeys.REPORT_TYPE)}
            onChange={onToggleChange}
          />
          <ButtonWrapper shift={"right"}>
            <Button
              primary
              type="submit"
              title="Continue"
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
