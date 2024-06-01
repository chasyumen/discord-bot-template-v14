module.exports.name = "test";
module.exports.description = {
    default: "test",
    en_US: "test",
    ja: "test"
};
module.exports.category = "dev";
module.exports.aliases = ["test2"];
module.exports.hide = true;
module.exports.disableSlash = false;
module.exports.slashOptions = {};
module.exports.permissions = {
    userInBot: 2,
    botNeeded: 8n,
    guildMember: 0n,
}
module.exports.exec = async function (cmd) {
    cmd.reply("test done!");
    // console.log(cmd);
};