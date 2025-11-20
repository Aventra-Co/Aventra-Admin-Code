import React from "react";
import  { useContext } from "react";
import { TranslatorContext } from "../context/Translator"



export default function FooterLayout() {
    const { t } = useContext(TranslatorContext);
    return (
        <footer className="mc-footer">{t('all_rights')}</footer>
        // <footer className="mc-footer">© All Rights Reserved by Clinic App</footer>
    )
}