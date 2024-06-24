import { SlashCommandStringOption } from "@discordjs/builders";
import { PermissionFlagsBits } from "discord.js";
import { inspect } from "util";

export const name = "shutdown";
export const descriptions = {
    en_US: "only developers",
    ja: "開発者のみ"
};
export const category = "dev";
// export const aliases = []; //not recommended
export const commandType = "1"; //1: BaseCommand, 2: SubCommand, 3: SubCommandGroup
export const parentCommand = null;
export const parentGroup = null;
export const guildCommand = true;
export const dm = false;
export const hide = true;
export const isNsfw = false;
export const slashOptions = [];
export const permissions = {
    internal: ["Developer"],
    botNeededInChannel: [PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel],
    botNeededInGuild: 0n,
    userNeeded: [],
}
export async function exec(cmd) {
    await cmd.reply("Stopping...");
    process.send({type: "shutdownSignal"});
    return;
}