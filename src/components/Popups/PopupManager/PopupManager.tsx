import { FC, useCallback } from "react";
import { Popup } from "src/components/Popup/Popup";
import { ColumnSelector } from "../ColumnSelector/ColumnSelector";
import { CreateNewReport } from "../CreateNewReport/CreateNewReport";
import { Filters } from "../Filters/Filters";
import { RootState, useAppSelector } from "src/store/store";
import {
  setCreateNewReportOpen,
  setColumnSelectorOpen,
  setIsFiltersOpen,
  setEditColumnSelectorOpen,
  setReportEditOpen,
  setIsEditFiltersOpen,
} from "src/store/managerSlice";
import { useAppDispatch } from "src/store/store";
import { DeleteEntry } from "../DeleteEntry/DeleteEntry";
import { FormProvider, useForm } from "react-hook-form";
import { schema } from "src/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { UnsavedChangesPopup } from "../UnsavedChangesPopup/UnsavedChangesPopup";
import { EditReport } from "../EditReport/EditReport";
import { EditColumnSelector } from "../EditColumnSelector/EditColumnSelector";
import { EditFilters } from "../EditFilters/EditFilters";
import { SaveFiltersChanges } from "../SaveFiltersChanges/SaveFiltersChanges";
import { DotSpinner } from "src/components/DotSpinner/DotSpinner";

export const PopupManager: FC = () => {
  const methods = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useAppDispatch();
  const {
    isCreateNewReportOpen,
    isColumnSelectorOpen,
    isFiltersOpen,
    isDeleteEntryOpen,
    isUnsavedChanges,
    isEditReportOpen,
    isEditColumnSelectorOpen,
    isEditFiltersOpen,
    isSaveFiltersChangesOpen,
    isDeleteReport,
    isCreateReport,
  } = useAppSelector((state: RootState) => state.manager);

  const openColumnSelector = useCallback((): void => {
    dispatch(setCreateNewReportOpen(false));
    dispatch(setColumnSelectorOpen(true));
  }, [dispatch]);

  const openFilterPopup = useCallback((): void => {
    dispatch(setColumnSelectorOpen(false));
    dispatch(setIsFiltersOpen(true));
  }, [dispatch]);

  const openEditColumnSelector = useCallback((): void => {
    dispatch(setReportEditOpen(false));
    dispatch(setEditColumnSelectorOpen(true));
  }, [dispatch]);

  const openEditFilterPopup = useCallback((): void => {
    dispatch(setEditColumnSelectorOpen(false));
    dispatch(setIsEditFiltersOpen(true));
  }, [dispatch]);

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
          <Popup open={isFiltersOpen} align={isCreateReport ? "center" : "right"}>
            { isCreateReport ? <DotSpinner /> : <Filters /> }
          </Popup>
        )}
        {isEditReportOpen && (
          <Popup open={isEditReportOpen} align={"center"}>
            <EditReport onContinue={openEditColumnSelector} />
          </Popup>
        )}
        {isEditColumnSelectorOpen && (
          <Popup open={isEditColumnSelectorOpen}>
            <EditColumnSelector onContinue={openEditFilterPopup} />
          </Popup>
        )}
        {isEditFiltersOpen && (
          <Popup open={isEditFiltersOpen} align={"right"}>
            <EditFilters />
          </Popup>
        )}
        {isDeleteEntryOpen && (
          <Popup open={isDeleteEntryOpen} align={"center"}>
            { isDeleteReport ? <DotSpinner /> : <DeleteEntry /> }
          </Popup>
        )}
        {isUnsavedChanges && (
          <Popup open={isUnsavedChanges} align={"center"}>
            <UnsavedChangesPopup />
          </Popup>
        )}
        {isSaveFiltersChangesOpen && (
          <Popup open={isSaveFiltersChangesOpen} align={"center"}>
            <SaveFiltersChanges />
          </Popup>
        )}
      </div>
    </FormProvider>
  );
};
