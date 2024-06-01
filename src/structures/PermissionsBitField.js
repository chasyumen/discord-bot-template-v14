const { BitField } = require("discord.js");
const async2 = require("async");

class BitField2 extends BitField {// extends BitField 
    constructor(data) {
        if (typeof data !== "number") {
            data = Number(data);
        }
        if (!data) {
            data = 0;
        }
        super(data);
        this.data = Number(data);
        this._has = super.has;
    };

    hasAdmin() {
        return this.has("ADMINISTRATOR");
    }

    has(flags, checkAdmin = true) {
        if (!flags) return false;
        if (typeof flags == "bigint") return this._has(flags);
        if (typeof flags !== "object") flags = [flags];
        var passable = true;
        var error = false;
        var bitfield = [];
        let parent = this;
        let defFlags = this.FLAGS;
        // console.debug(flags)
        flags.forEach(flag => {
            // console.debug(typeof flag);
            if (typeof flag == "bigint" || typeof flag == "number") {
                if (parent._has(flag)) {
                    return true;
                } else {
                    passable = false;
                    error = true;
                    return false;
                }
            }
            if (!defFlags[flag]) {
                // throw new Error(`Unrecognized flag specified: ${flag}`);
                passable = false;
                return;
            }
            bitfield.push(defFlags[flag]);

            if (parent._has(defFlags[flag])) {
                return true;
            } else {
                passable = false;
            }
        });
        if (!error && checkAdmin && this._has(this.FLAGS["ADMINISTRATOR"])) passable = true;
        return passable;
    }

    FLAGS = {
        "ADMINISTRATOR": 1 << 0, //1
        "TESTER": 1 << 1, //2
        "DANGER_COMMANDS": 1 << 2, //4
        "IGNORE_COOLDOWN": 1 << 3, //8
    }

}

module.exports = BitField2;