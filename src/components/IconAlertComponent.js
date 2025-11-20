import React, { useContext } from "react";
import { ButtonComponent } from "./elements";
import { TranslatorContext } from "../context/Translator"

export default function IconAlertComponent({ classes, icon, title, text }) {
    const { t } = useContext(TranslatorContext)
    
    return (
        <div className={`mc-alert ${ classes }`}>
            <i className="material-icons">{icon}</i>
            <h3>{ title }<span>{ text }</span></h3>
            <ButtonComponent className="material-icons">{t('close')}</ButtonComponent>
        </div>
    )
}