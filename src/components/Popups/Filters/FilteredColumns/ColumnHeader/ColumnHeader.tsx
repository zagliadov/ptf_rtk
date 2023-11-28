import { FC } from "react";
import styles from "./ColumnHeader.module.scss";
import classnames from "classnames/bind";
import { ReactComponent as DnDIcon } from "src/assets/icons/drag-and-drop-icon.svg";
import { ReactComponent as BookmarkIcon } from "src/assets/icons/bookmark-icon.svg";
import { ReactComponent as ColumnInfoIcon } from "src/assets/icons/column-info-icon.svg";
import { Reorder } from "framer-motion";
import ReactDOM from "react-dom";
import { DnDInfoPopup } from "src/components/Popups/DnDInfoPopup/DnDInfoPopup";
import { useHoverPositionVisibility } from "src/hook/useHoverPositionVisibility";
import { EDataKeys, IIFilters } from "src/types";
import { BookmarkInfoPopup } from "src/components/Popups/BookmarkInfoPopup/BookmarkInfoPopup";
import { useFormContext } from "react-hook-form";
import * as _ from "lodash";
import { DescriptionPopup } from "src/components/Popups/DescriptionPopup/DescriptionPopup";

const cx: CX = classnames.bind(styles);

interface IProps {
  item: IIFilters;
  filteredList: IIFilters[];
}

export const ColumnHeader: FC<IProps> = ({ item, filteredList }) => {
  const { setValue } = useFormContext();
  const {
    isVisible: isDnDInfoVisible,
    position: DnDInfoPosition,
    handleMouseEnter: handleDnDInfoMouseEnter,
    handleMouseLeave: handleDnDInfoMouseLeave,
  } = useHoverPositionVisibility({});
  const {
    isVisible: isBookmarkInfoVisible,
    position: bookmarkInfoPosition,
    handleMouseEnter: handleBookmarkInfoMouseEnter,
    handleMouseLeave: handleBookmarkInfoMouseLeave,
  } = useHoverPositionVisibility({});

  const {
    isVisible: isColumnItemInfoVisible,
    position: columnInfoPosition,
    handleMouseEnter: handleColumnInfoMouseEnter,
    handleMouseLeave: handleColumnInfoMouseLeave,
  } = useHoverPositionVisibility({});

  const handleChangeCheckbox = (id: number) => {
    const filter = _.find(filteredList, { id: id });
    if (filter) {
      filter[EDataKeys.PIN_TO_MAIN_VIEW] = !filter[EDataKeys.PIN_TO_MAIN_VIEW];
      setValue(EDataKeys.FILTERED_LIST, filteredList);
    }
  };

  return (
    <div className={cx("column-header")}>
      <Reorder.Item key={item.id} value={item}>
        <button
          type="button"
          onMouseEnter={handleDnDInfoMouseEnter}
          onMouseLeave={handleDnDInfoMouseLeave}
          className={cx("drag-and-drop-icon")}
        >
          <DnDIcon />
        </button>
      </Reorder.Item>

      <button
        type="button"
        onMouseEnter={handleBookmarkInfoMouseEnter}
        onMouseLeave={handleBookmarkInfoMouseLeave}
        className={cx("bookmark-icon")}
        onClick={() => handleChangeCheckbox(item.id)}
      >
        <BookmarkIcon className={cx(item.pinToMainView && "item-no-pin")} />
      </button>

      <span className={cx("column-name")}>{item.name}</span>

      <div
        className={cx("info-icon")}
        onMouseEnter={handleColumnInfoMouseEnter}
        onMouseLeave={handleColumnInfoMouseLeave}
      >
        <ColumnInfoIcon />
      </div>
      {isDnDInfoVisible &&
        ReactDOM.createPortal(
          <DnDInfoPopup position={DnDInfoPosition} />,
          document.body
        )}
      {isBookmarkInfoVisible &&
        ReactDOM.createPortal(
          <BookmarkInfoPopup position={bookmarkInfoPosition} />,
          document.body
        )}
      {isColumnItemInfoVisible &&
        item?.description &&
        ReactDOM.createPortal(
          <DescriptionPopup
            position={columnInfoPosition}
            description={item?.description}
          />,
          document.body
        )}
    </div>
  );
};
