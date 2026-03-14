import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(HttpApi)
    .init({
        fallBackLng: "en",
        supportedLngs: ['en', 'ar'],
        react: {
            transSupportBasicHtmlNodes: true,
            transKeepBasicHtmlNodesFor: ["br", "strong", "b", "i"],
        },
        detection: {
            order: ['cookie', 'htmlTag', 'localStorage', 'path', 'subdomain'],
            caches: ['cookie']
        },
        backend: {
            loadPath: '/temp/admin/locales/{{lng}}.json'
        },
    });

export default i18n;