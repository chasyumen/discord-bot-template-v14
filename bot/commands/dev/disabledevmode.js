import { SlashCommandStringOption } from "@discordjs/builders";
import { eachSeries } from "async";
import { ApplicationCommandType, PermissionFlagsBits } from "discord.js";
import { inspect } from "util";

export const name = "disabledevmode";
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
    await cmd.deferReply({ephemeral: true});
    await cmd.guild.commands.fetch();
    await eachSeries(cmd.guild.commands.cache.toJSON(), async (cmdd) => {
        if (cmdd.type !== ApplicationCommandType.ChatInput) return;
        if (cmdd.guildId == cmd.guild.id) return await cmdd.delete();
    });
    await cmd.reply({content: "done", ephemeral: true});
}