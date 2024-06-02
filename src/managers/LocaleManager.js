import { Collection } from "discord.js";
import { readdir } from "fs";
import { get } from "http";
import { join } from "path";

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
        const locales = await new Promise(resolve => readdir("./src/locale",(error, result) => resolve(result)));
        return locales.filter(x => x.endsWith('.js')).forEach(async file => {
            let locale = await import("../locale/"+file);
            this.set(locale.name, locale);
            this.list.push(locale.name)
        });
    }

    getString(id, lang) {
        if (!lang) lang = config.defaultLanguage;
        if (!this.has(lang)) lang = config.defaultLanguage;
        var locale = this.get(lang);
        var localeData = locale.data;
        var defaultLocale = this.get(config.defaultLanguage);
        var defaultLocaleData = defaultLocale.data;
        var defaultLang = config.defaultLanguage;

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
            } else {
                var nData = json[spl[0]]
                spl.shift();
                return getdata(spl, nData, id, lang);
            }
        }

        return getdata(splitted, localeData, id, lang);
    }
}