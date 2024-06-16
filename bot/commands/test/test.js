import { PermissionFlagsBits } from "discord.js";

export const name = "test";
export const descriptions = {
    en_US: "This is a test command.",
    ja: "これはテスト用コマンドです。"
};
export const category = "dev";
// export const aliases = []; //not recommended
export const commandType = "1"; //1: BaseCommand, 2: SubCommand, 3: SubCommandGroup
export const parentCommand = null;
export const parentGroup = null;
export const dm = false;
export const hide = false;
export const isNsfw = false;
export const slashOptions = [];
export const permissions = {
    internal: ["Tester"],
    botNeededInChannel: [PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ManageChannels],
    botNeededInGuild: 0n,
    userNeeded: [PermissionFlagsBits.ManageGuild],
}
export async function exec (cmd) {
    cmd.reply("test done!");
    // console.log(cmd);
}