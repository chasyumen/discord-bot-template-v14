import { Collection } from "discord.js";
import { readdir } from "fs";
import { get } from "http";
import { join } from "path";
import getDir from "../utils/getDir.js";
import { eachSeries } from "async";
import jsonDeepMerge from "../utils/jsonDeepMerge.js";

export default class LocaleManager extends Collection {
    constructor(client) {
        super();
        this.client = client;
        this.list = new Array();
    }

    async test( ) {
        import("../locale/en_US.js");
    }

    async loadAll() {
        // const locales = await new Promise(resolve => readdir("./src/locale",(error, result) => resolve(result)));
        var manager = this;
        const locales = await getDir(`./src/locale`);
        var localeData = {};
        var filtered = locales.filter(x => x.endsWith('.js'))
        await eachSeries(filtered, async file => {
            var dirnm = file.split("src/locale/")[1]
            let locale = await import("../locale/"+dirnm);
            if (!localeData[locale.language]) {
                localeData[locale.language] = {name: locale.language, data: {}};
            }
            Object.keys(locale.data).forEach(key => {
                if (localeData[locale.language].data[key]) {
                    localeData[locale.language].data[key].concat(locale.data[key])
                } else {
                    localeData[locale.language].data[key] = locale.data[key];
                }
            });
            // this.set(locale.name, locale);
            // this.list.push(locale.name);
        });
        // console.log(localeData);
        Object.keys(localeData).forEach(locale => {
            manager.set(locale, localeData[locale]);
            manager.list.push(locale);
        });
        return;
    }

    getString(id, lang) {
        if (!lang) lang = config.defaultLanguage;
        if (!this.has(lang)) lang = config.defaultLanguage;
        var defaultLocale = this.get(config.defaultLanguage);
        var defaultLocaleData = defaultLocale.data;
        var defaultLang = config.defaultLanguage;

        var locale = this.get(lang);
        var localeData = jsonDeepMerge(defaultLocaleData, locale.data);

        if (!id) return id;

        var splitted = id.split(".");
        function getdata(spl, json, id, lang) {
            if (spl.length <= 0) {
                if (typeof json == "object") {
                    return JSON.stringify(json);
                } else if (json == undefined && lang !== defaultLang) {
                    return getdata(id.split("."), defaultLocaleData, id, defaultLang)
                } else {
                    return json;
                }
            } else if (typeof json !== "object") {
                return id;
            } else if (typeof json == "undefined") {
                return id;
            } else {
                var nData = json[spl[0]]
                spl.shift();
                return getdata(spl, nData, id, lang);
            }
        }

        return getdata(splitted, localeData, id, lang);
    }
}