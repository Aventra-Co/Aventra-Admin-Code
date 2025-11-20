import React, { useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import DotsMenuComponent from "../DotsMenuComponent";
import { AnchorComponent } from "../elements";

export default function CardHeaderComponent({ title, dotsMenu, button }) {
    const { t } = useContext(TranslatorContext)
    return (
        <div className="mc-card-header">
            { title && <h4 className="mc-card-title">{ title }</h4> }
            { dotsMenu && <DotsMenuComponent dots={ dotsMenu.dots } dropdown={ dotsMenu.dropdown } /> }
            { button && <AnchorComponent className="mc-btn" href={ button.path } icon={ button.icon } text={ t(button.text) } /> }
        </div>
    )
}