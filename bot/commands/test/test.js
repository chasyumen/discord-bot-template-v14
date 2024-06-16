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
export const dm = true;
export const hide = true;
export const isNsfw = false;
export const slashOptions = [];
export const permissions = {
    internal: ["Tester"],
    botNeededInChannel: 0n,
    botNeededInGuild: 8n,
    userNeeded: [PermissionFlagsBits.ManageGuild],
}
export async function exec (cmd) {
    cmd.reply("test done!");
    // console.log(cmd);
}