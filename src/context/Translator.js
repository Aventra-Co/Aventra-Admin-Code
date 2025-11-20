import { createContext, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import languages from "../assets/data/languages.json";
import cookies from 'js-cookie';
import i18next from 'i18next';

export const TranslatorContext = createContext();

export const TranslatorProvider = ({ children }) => {

    const { t } = useTranslation();

    const currentLanguageCode = cookies.get('i18next');
    const currentLanguage = languages.find((language) => language.code === currentLanguageCode);

    function n(number) {
        const formatter = new Intl.NumberFormat(currentLanguage.tag);
        return formatter.format(number);
    }

    function c(number) {
        const formatter = new Intl.NumberFormat(currentLanguage.tag, {
            style: 'currency',
            currency: currentLanguage.currency,
            minimumFractionDigits: 2
        });
        return formatter.format(number);
    }

    function changeLanguage(languageCode) {
        window.location.reload();
        i18next.changeLanguage(languageCode);
        cookies.set('i18next', languageCode, { expires: 365 });
    }

    useEffect(() => {
        document.querySelector('html').dir = currentLanguage?.dir;
        document.querySelector('html').lang = currentLanguage?.code;
    }, [currentLanguage]);

    return (
        <TranslatorContext.Provider value={{ t, n, c, changeLanguage, currentLanguage }}>
            {children}
        </TranslatorContext.Provider>
    )
} 