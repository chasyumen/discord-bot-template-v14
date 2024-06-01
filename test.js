var PermissionsBitField = require("./src/structures/PermissionsBitField.js");

var perm = new PermissionsBitField(14);
console.log(perm.has(7))