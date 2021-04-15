
import CluarCustomData from './CluarCustomData';

import config from '../config/config';

let data = null;
let currentLanguage = null;
let customData = null;

export default class Cluar {
    static init() {
        data = window.cluarData;
        currentLanguage = Cluar.defaultLanguage();
        customData = new CluarCustomData(data);
    }

    static customData() {
        return customData;
    }

    static defaultLanguage() {
        return data.languages.find((e) => e.default === true);
    }

    static currentLanguage(codeOrLocale) {
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

    static plainDictionary(entry) {
        let value = data.dictionary[Cluar.currentLanguage().code] ? data.dictionary[Cluar.currentLanguage().code][entry] : null;
        if (value) {
            return (value).replace(/<\/?p[^>]*>/g, "")
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

    static api(path, settings) {
        const success = settings.onSuccess ? settings.onSuccess : () => { };
        const fail = settings.onFail ? settings.onFail : () => { };
        const configs = {
            method: settings.method ? settings.method : 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": 'application/json',
                "Accept": 'application/json'
            }
        };
        if (settings.data) {
            configs.body = JSON.stringify(settings.data);
        }
        fetch(config.cluar.api + path, configs).then(
            (response) => {
                if (response.ok) {
                    if (response.status === 204) {
                        return success();
                    } else {
                        const contentType = response.headers.get("Content-Type");
                        if (contentType && contentType.toLowerCase().indexOf("application/json") === 0) {
                            return response.json().then((data) => {
                                success({ json: data });
                            });
                        } else {
                            return response.text().then((text) => {
                                success({ text: text });
                            });
                        }
                    }
                } else {
                    return fail({ response: response });
                }
            }
        ).catch((e) => {
            fail({ error: e });
        });
    }
}
