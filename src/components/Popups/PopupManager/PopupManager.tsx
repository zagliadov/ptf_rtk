import { FC } from "react";
import { Popup } from "src/components/Popup/Popup";
import { ColumnSelector } from "../ColumnSelector/ColumnSelector";
import { CreateNewReport } from "../CreateNewReport/CreateNewReport";
import { Filters } from "../Filters/Filters";
import { RootState, useAppSelector } from "src/store/store";
import {
  setCreateNewReportOpen,
  setColumnSelectorOpen,
  setIsFiltersOpen,
} from "src/store/managerSlice";
import { useAppDispatch } from "src/store/store";
import { SaveFiltersChanges } from "../SaveFiltersChanges/SaveFiltersChanges";
import { DeleteEntry } from "../DeleteEntry/DeleteEntry";
import { FormProvider, useForm } from "react-hook-form";
import { schema } from "src/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { DynamicFormData } from "src/types";

export const PopupManager: FC = () => {
  const methods = useForm<DynamicFormData>({
    resolver: yupResolver(schema),
  });
  const dispatch = useAppDispatch();
  const {
    isCreateNewReportOpen,
    isColumnSelectorOpen,
    isFiltersOpen,
    isSaveNewReportOpen,
    isDeleteEntryOpen,
  } = useAppSelector((state: RootState) => state.manager);

  const openColumnSelector = () => {
    dispatch(setCreateNewReportOpen(false));
    dispatch(setColumnSelectorOpen(true));
  };

  const openFilterPopup = () => {
    dispatch(setColumnSelectorOpen(false));
    dispatch(setIsFiltersOpen(true));
  };

  return (
    <FormProvider {...methods}>
      <div>
        {isCreateNewReportOpen && (
          <Popup open={isCreateNewReportOpen}>
            <CreateNewReport onContinue={openColumnSelector} />
          </Popup>
        )}
        {isColumnSelectorOpen && (
          <Popup open={isColumnSelectorOpen}>
            <ColumnSelector onContinue={openFilterPopup} />
          </Popup>
        )}
        {isFiltersOpen && (
          <Popup open={isFiltersOpen} align={"right"}>
            <Filters />
          </Popup>
        )}
        {isSaveNewReportOpen && (
          <Popup open={isSaveNewReportOpen} align={"center"}>
            <SaveFiltersChanges />
          </Popup>
        )}
        {isDeleteEntryOpen && (
          <Popup open={isDeleteEntryOpen} align={"center"}>
            <DeleteEntry />
          </Popup>
        )}
      </div>
    </FormProvider>
  );
};