import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import { IS_BROWSER } from "$fresh/runtime.ts";

console.log("!!!!!!!!!");

i18n
  .use({
    type: "backend",
    read(
      language: string,
      namespace: string,
      callback: (errorValue: unknown, translations: any) => void
    ) {
      const url = IS_BROWSER
        ? `/locales/${language}/${namespace}.json`
        : new URL(
            `../static/locales/${language}/${namespace}.json`,
            import.meta.url
          );
      console.log("IS_BROWSER", IS_BROWSER);
      console.log("url", url);
      fetch(url)
        .then((resp) => resp.json())
        .then((resources) => callback(null, resources))
        .catch((error) => callback(error, null));
    },
  })
  .use(initReactI18next)
  .init({
    ns: "common",
    defaultNS: "common",
    fallbackLng: "en",
    debug: false,
  });

export { i18n };
