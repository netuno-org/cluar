import _service from "@netuno/service-client";
import ReactGA from "react-ga";
import CluarCustom from "./CluarCustom";
import _auth from "@netuno/auth-client";

let data = null;
let cluarSettings = null;
let currentLanguage = null;
let custom = null;
let gaEnabled = false;

export default class Cluar {
  static init() {
    data = window.cluar;
    cluarSettings = window.cluarSettings;
    currentLanguage = Cluar.defaultLanguage();
    console.log(Cluar.defaultLanguage());
    custom = new CluarCustom(data);
    _service.config({
      prefix: cluarSettings.config.services.api,
    });
    _auth.config({
      storage: "local",
    });
    if (cluarSettings.config.analytics && cluarSettings.config.analytics !== "") {
      ReactGA.initialize(cluarSettings.config.analytics);
      gaEnabled = true;
    }
  }

  static authProviders() {
    const { auth } = window.cluarSettings;
    return auth?.providers;
  }

  static authAltcha() {
    const { auth } = window.cluarSettings;
    return !!auth.altcha;
  }

  static custom() {
    return custom;
  }

  static config() {
    return cluarSettings.config;
  }

  static isGAEnabled() {
    return gaEnabled;
  }

  static defaultLanguage() {
    return data.languages.find((e) => e.default === true);
  }

  static currentLanguage() {
    return currentLanguage;
  }

  static changeLanguage(codeOrLocale) {
    currentLanguage = data.languages.find(
      (e) => e.code === codeOrLocale || e.locale === codeOrLocale,
    );
    if (!currentLanguage) {
      currentLanguage = Cluar.defaultLanguage();
    }
    if (currentLanguage) {
      window.localStorage.setItem("locale", currentLanguage.locale);
    }
  }

  static languages() {
    return data.languages;
  }

  static pages() {
    if (!data._pagesNormalized) {
      for (const lang of Object.keys(data.pages)) {
        for (const p of data.pages[lang]) {
          if (p.link && !p.link.startsWith('/')) {
            p.link = '/' + p.link;
          }
          if (p.parent && !p.parent.startsWith('/')) {
            p.parent = '/' + p.parent;
          }
        }
      }
      data._pagesNormalized = true;
    }
    return data.pages;
  }

  static actions() {
    return data?.actions;
  }

  static configuration(parameter) {
    let value = data.configuration[Cluar.currentLanguage().code]
      ? data.configuration[Cluar.currentLanguage().code][parameter]
      : null;
    if (!value) {
      value = data.configuration["GENERIC"]
        ? data.configuration["GENERIC"][parameter]
        : null;
    }
    if (value) {
      return value;
    }
    return parameter;
  }

  static configurationNumber(parameter) {
    const value = Cluar.configuration(parameter);
    if (value && value.match(/^-?\d+\.?\d*$/)) {
      return parseFloat(value);
    } else {
      return 0;
    }
  }

  static configurationMultilines(parameter) {
    let value = Cluar.configuration(parameter);
    value = value.replace(/(?:\r\n|\r|\n)/g, "<br>");
    return value;
  }

  static plainTranslation(entry) {
    let value = Cluar.translation(entry);
    if (value) {
      return value.replace(/<\/?((p)|(br))[^>]*>/g, "");
    }
    return entry;
  }

  static plainTitle(entry) {
    let value = Cluar.translation(entry);
    if (value) {
      return value.replace(/<\/?p[^>]*>/g, "");
    }
    return entry;
  }

  static plainHTML(entry) {
    let value = Cluar.translation(entry);
    if (value) {
      return value.replace(/<[^>]*>/g, "");
    }
    return entry;
  }

  static translationNoParagraph(entry) {
    let value = Cluar.translation(entry);
    if (value) {
      return value.replace(/<\/?p[^>]*>/g, "");
    }
    return entry;
  }

  static translation(entry) {
    let value = data.translation[Cluar.currentLanguage().code]
      ? data.translation[Cluar.currentLanguage().code][entry]
      : null;
    if (value) {
      return value;
    }
    return entry;
  }

  static hasTranslation(entry) {
    return !!data.translation[Cluar.currentLanguage().code]
      ? !!data.translation[Cluar.currentLanguage().code][entry]
      : false;
  }

  static banner(type) {
    const i = data.banners.find(
      (e) => e.type === type && e.language === Cluar.currentLanguage().code,
    );
    if (i) {
      return i;
    }
    return {
      type,
      language: Cluar.currentLanguage().code,
      title: type,
      content: type,
      image: null,
    };
  }

  static content(type) {
    const i = data.contents.find(
      (e) => e.type === type && e.language === Cluar.currentLanguage().code,
    );
    if (i) {
      return i;
    }
    return {
      type,
      language: Cluar.currentLanguage().code,
      title: type,
      content: type,
    };
  }
}
