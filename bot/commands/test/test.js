module.exports.name = "test";
module.exports.descriptions = {
    en_US: "test",
    ja: "test"
};
module.exports.category = "dev";
module.exports.aliases = ["test2"];
module.exports.hide = true;
module.exports.disableSlash = false;
module.exports.slashOptions = {};
module.exports.permissions = {
    user: ["TESTER"],
    botNeeded: 8n,
    guildMember: 8n,
}
module.exports.exec = async function (cmd) {
    cmd.reply("test done!");
    // console.log(cmd);
};