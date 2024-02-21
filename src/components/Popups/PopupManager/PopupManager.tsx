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
  setCreateCopyReportOpen,
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
import { ShowAllFilters } from "../ShowAllFilters/ShowAllFilters";
import { SaveFilterChanges } from "../SaveFilterChanges/SaveFilterChanges";
import { CreateCopyReport } from "../CreateCopyReport/CreateCopyReport";
import { NotReportCreatorPopup } from "../NotReportCreatorPopup/NotReportCreatorPopup";

interface IProps {
  refetchReportsArray: any;
}

export const PopupManager: FC<IProps> = ({ refetchReportsArray }) => {
  const methods = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useAppDispatch();
  const {
    isCreateNewReportOpen,
    isCreateCopyReportOpen,
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
    isShowAllFiltersOpen,
    isFilterChanges,
    isNotReportCreator,
  } = useAppSelector((state: RootState) => state.manager);
  const { createReportLoading } = useAppSelector(
    (state: RootState) => state.report
  );

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

  const openCreateCopyReport = useCallback((): void => {
    dispatch(setCreateCopyReportOpen(false));
  }, [dispatch]);

  return (
    <FormProvider {...methods}>
      <div>
        {isCreateNewReportOpen && (
          <Popup open={isCreateNewReportOpen}>
            <CreateNewReport
              onContinue={openColumnSelector}
              refetchReportsArray={refetchReportsArray}
            />
          </Popup>
        )}
        {isCreateCopyReportOpen && (
          <Popup open={isCreateCopyReportOpen}>
            {isCreateReport ? (
              <DotSpinner />
            ) : (
              <CreateCopyReport
                onContinue={openCreateCopyReport}
                refetchReportsArray={refetchReportsArray}
              />
            )}
          </Popup>
        )}
        {isColumnSelectorOpen && (
          <Popup open={isColumnSelectorOpen}>
            <ColumnSelector onContinue={openFilterPopup} />
          </Popup>
        )}
        {isFiltersOpen && (
          <Popup
            open={isFiltersOpen}
            align={isCreateReport ? "center" : "right"}
          >
            {isCreateReport ? <DotSpinner /> : <Filters />}
          </Popup>
        )}
        {isEditReportOpen && (
          <Popup open={isEditReportOpen} align={"center"}>
            <EditReport
              onContinue={openEditColumnSelector}
              refetchReportsArray={refetchReportsArray}
            />
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
            {isDeleteReport ? <DotSpinner /> : <DeleteEntry />}
          </Popup>
        )}
        {isUnsavedChanges && (
          <Popup open={isUnsavedChanges} align={"center"}>
            <UnsavedChangesPopup />
          </Popup>
        )}
        {isShowAllFiltersOpen && (
          <Popup open={isShowAllFiltersOpen} align={"right"}>
            <ShowAllFilters />
          </Popup>
        )}
        {isSaveFiltersChangesOpen && (
          <Popup open={isSaveFiltersChangesOpen} align={"center"}>
            {createReportLoading ? <DotSpinner /> : <SaveFiltersChanges />}
          </Popup>
        )}
        {isFilterChanges && (
          <Popup open={isFilterChanges} align={"center"}>
            {<SaveFilterChanges />}
          </Popup>
        )}
        {isNotReportCreator && (
          <Popup open={isNotReportCreator} align={"center"}>
            {<NotReportCreatorPopup />}
          </Popup>
        )}
      </div>
    </FormProvider>
  );
};
