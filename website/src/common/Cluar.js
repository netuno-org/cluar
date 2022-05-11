
import _service from '@netuno/service-client';
import ReactGA from 'react-ga';
import CluarCustomData from './CluarCustomData';

let data = null;
let currentLanguage = null;
let customData = null;
let gaEnabled = false;

export default class Cluar {
  static init() {
    data = window.cluarData;
    currentLanguage = Cluar.defaultLanguage();
    customData = new CluarCustomData(data);
    _service.config({
      prefix: data.config.services.api
    });
    if (data.config.analytics && data.config.analytics !== '') {
      ReactGA.initialize(data.config.analytics);
      gaEnabled = true;
    }
  }

  static customData() {
    return customData;
  }

  static config() {
    return data.config;
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
    currentLanguage = data.languages.find((e) => e.code === codeOrLocale || e.locale === codeOrLocale);
  }

  static languages() {
    return data.languages;
  }

  static pages() {
    return data.pages;
  }

  static configuration(parameter) {
    let value = data.configuration[Cluar.currentLanguage().code] ? data.configuration[Cluar.currentLanguage().code][parameter] : null;
    if (!value) {
      value = data.configuration['GENERIC'] ? data.configuration['GENERIC'][parameter] : null;
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
    value = value.replace(/(?:\r\n|\r|\n)/g, '<br>');
    return value;
  }

  static plainDictionary(entry) {
    let value = Cluar.dictionary(entry);
    if (value) {
      return (value).replace(/<\/?((p)|(br))[^>]*>/g, "");
    }
    return entry;
  }

  static dictionaryNoParagraph(entry) {
    let value = Cluar.dictionary(entry);
    if (value) {
      return (value).replace(/<\/?p[^>]*>/g, "");
    }
    return entry;
  }

  static dictionary(entry) {
    let value = data.dictionary[Cluar.currentLanguage().code] ? data.dictionary[Cluar.currentLanguage().code][entry] : null;
    if (value) {
      return value;
    }
    return entry;
  }

  static banner(type) {
    const i = data.banners.find((e) => e.type === type && e.language === Cluar.currentLanguage().code);
    if (i) {
      return i;
    }
    return { type, language: Cluar.currentLanguage().code, title: type, content: type, image: null };
  }

  static content(type) {
    const i = data.contents.find((e) => e.type === type && e.language === Cluar.currentLanguage().code);
    if (i) {
      return i;
    }
    return { type, language: Cluar.currentLanguage().code, title: type, content: type };
  }
}
