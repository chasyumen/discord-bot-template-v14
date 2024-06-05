import { PermissionsBitField } from "discord.js";

class ExtendedPermissionsBitField extends PermissionsBitField {// extends BitField 
    constructor(...data) {
        super(...data);
    };


    /**
     * Get bits from passed FLAGS.
     * @param {Array} array 
     * @returns {Number}
     */
    
    static getBits(array) {
        if (typeof array == "number" || typeof array == "bigint") return array;
        if (typeof array == "string") array = [array];
        if (typeof array !== "object") throw new TypeError("Expected string or object but received "+ typeof array);
        var bits = 0;
        array.forEach((permType) => {
            if (typeof permType == "bigint" || typeof permType == "number") {
                throw new TypeError("Number or bigint types are not supported for this function")
            }
            if (!FLAGS[permType]) return false;
            bits = bits + FLAGS[permType];
        });
        return bits;
    }
}

let FLAGS = PermissionsBitField.Flags;


export default ExtendedPermissionsBitField;