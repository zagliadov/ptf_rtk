import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Tooltip.module.scss";

const cx: CX = classNames.bind(styles);
/*eslint-disable*/
function Tooltip(props: any) {
    props.reactContainer.classList.add('custom-tooltip');
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const elem = document.createElement("div");
        elem.style.width = `${props.column.actualWidth}px`;
        elem.style.whiteSpace = "nowrap";
        elem.style.overflow="hidden";
        elem.innerText = props.value;
        document.body.append(elem);
        
        if(elem.offsetWidth < elem.scrollWidth) {
            setVisible(true);
        }
        document.body.removeChild(elem);
    },[props])

    return (
        visible ? 
        <div
            className={cx("custom-tooltip")}
            style={{ backgroundColor: props.color || 'white' }}
        >
            {props.value}
        </div>
        :null
    );
};

export default Tooltip;