import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import mongoose from "mongoose";
import { eachSeries } from 'async';
import getDir from "../utils/getDir.js";

export default class DataBase {
    constructor () {this._mongoose = mongoose; this.models = {}; this.cache = {};}
    async connect (...data) {
        return await this._mongoose.connect(...data);
    }

    async load_models() {
        var dirs = await getDir("./src/database/models");
        // console.log(dirs)
        return dirs.filter(x => x.endsWith('.js')).forEach(async file => {
            // client.log("DEBUG", file)
            let db = await import("../../" + file);
            this[file.split("/")[file.split("/").length-1].replace(".js", "")] = db.default;
            this.models[file.split("/")[file.split("/").length-1].replace(".js", "")] = db.default;
        });
    }

    async saveCache() {
        var cache = {};
        await eachSeries(Object.keys(this.models), async (key) => {
            cache[key] = await this.models[key].find();
        });
        this.cache = cache;
        return cache;
    }
}