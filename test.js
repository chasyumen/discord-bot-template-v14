var PermissionsBitField = require("./src/structures/PermissionsBitField.js");

var perm = new PermissionsBitField(14);
console.log(PermissionsBitField.getBits("ADMINISTRATOR"))
console.log(perm.has([2,6]))