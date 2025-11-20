import React, { useContext } from "react";
import { TranslatorContext } from "../context/Translator";

export default function DivideTitleComponent({ as, className, title, children }) {
    const { t } = useContext(TranslatorContext) 
    const Component = as || "h6";
    return <Component className={`mc-divide-title ${ className ? className : "" }`}>{ title || children || t('divide_title') }</Component>
}