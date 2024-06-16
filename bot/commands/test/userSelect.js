import { SlashCommandUserOption } from "@discordjs/builders";

export const name = "user";
export const descriptions = {
    en_US: "test select user",
    ja: "ユーザー選択test"
};
export const category = "dev";
export const commandType = "1"; //1: BaseCommand, 2: SubCommand, 3: SubCommandGroup
export const parentCommand = null;
export const parentGroup = null;
export const dm = false;
export const hide = true;
export const isNsfw = false;
export const slashOptions = [
    new SlashCommandUserOption().setName("user").setDescription("User").setRequired(true),
];
export const permissions = {
    internal: ["Tester"],
    botNeededInChannel: 0n,
    botNeededInGuild: 8n,
    userNeeded: 8n,
}
export async function exec (cmd) {
    console.log(cmd.interaction.options.getUser("user"))
    cmd.reply(cmd.interaction.options.getUser("user").id);
    // console.log(cmd);
}