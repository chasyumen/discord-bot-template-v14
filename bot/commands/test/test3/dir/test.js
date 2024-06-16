import { PermissionFlagsBits } from "discord.js";

export const name = "test3";
export const descriptions = {
    en_US: "dir command test",
    ja: "階層化テスト"
};
export const commandType = "2"; //1: BaseCommand, 2: SubCommand, 3: SubCommandGroup
export const parentCommand = "test34";
export const parentGroup = "dir";
export const slashOptions = [];
export const permissions = {
    internal: ["Tester"],
    botNeededInChannel: 0n,
    botNeededInGuild: 8n,
    userNeeded: 8n,
}
export async function exec (cmd) {
    cmd.reply("階層化コマンド実行成功");
    // console.log(cmd);
}