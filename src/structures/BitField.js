import { BitField } from "discord.js";
import async2 from "async";

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

    // async hasAdmin() {
    //     return this.has("ADMINISTRATOR");
    // }

    has(flags) {
        if (typeof flags == "bigint") return this._has(flags);
        if (typeof flags !== "object") flags = [flags];
        var passable = true;
        var bitfield = [];
        let parent = this;
        let defFlags = this.FLAGS;
        console.log(flags)
        flags.forEach(flag => {
            console.debug(typeof flag);
            if (typeof flag == "bigint" || typeof flag == "number") {
                if (parent._has(flag)) {
                    return true;
                } else {
                    passable = false;
                    return false;
                }
            }
            if (!defFlags[flag]) {
                // throw new Error(`Unrecognized flag specified: ${flag}`);
                passable = false;
            }
            bitfield.push(defFlags[flag]);

            if (parent._has(defFlags[flag])) {
                return true;
            } else {
                passable = false;
            }
        });
        return passable;
    }

    FLAGS = {}

    // FLAGS = {
    //     "ADMINISTRATOR": 1 << 0, //1
    //     "TESTER": 1 << 1, //2
    //     "DANGER_COMMANDS": 1 << 2, //4
    //     "IGNORE_COOLDOWN": 1 << 3, //8
    // }

    // async hasAll(flags) {
    //     var isOkay = true;
    //     var parent = this;
    //     await async2.eachSeries(flags, async function (flag,) {
    //         if (parent.has(flag)) {
    //             return true;
    //         } else {
    //             isOkay = false;
    //         }
    //         return;
    //     });
    //     if (this.has("ADMINISTRATOR")) {
    //         return true;
    //     } else {
    //         return isOkay;
    //     }
    // }

}

export default BitField2;