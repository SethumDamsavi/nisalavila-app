import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import si from "./si.json";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: { translation: en },
    si: { translation: si },
  },
  interpolation: { escapeValue: false },
});

export default i18n;
