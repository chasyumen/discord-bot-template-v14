// import ExtendedPermissionsBitField from "./src/structures/ExtendedPermissionsBitField.js";

// console.log(ExtendedPermissionsBitField.getBits(2n));

// import PermissionsBitField from "./src/structures/InternalPermissionsBitField.js";

// var perm = new PermissionsBitField(14);
// console.log(PermissionsBitField.getBits("Administrator"))
// console.log(perm.has([2,6]))

// import test from "./bot/commands/test/test.js"

// console.log(test);

(async () => {
    var cmd = await import("./bot/commands/test/testu.js");
    console.log(cmd);
})();