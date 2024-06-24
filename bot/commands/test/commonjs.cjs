const { PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "commonjs",
    descriptions: {
        en_US: "This is a test command.",
        ja: "これはテスト用コマンドです。"
    },
    category: "test",
    commandType: "1",
    parentCommand: null,
    parentGroup: null,
    dm: false,
    hide: true,
    isNsfw: false,
    slashOptions: [],
    permissions: {
        internal: [],
        botNeededInChannel: [PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ManageChannels],
        botNeededInGuild: 0n,
        userNeeded: [PermissionFlagsBits.ManageGuild],
    },
    exec: async function (cmd) {
        cmd.reply("test done!");
        // console.log(cmd);
    }
}
