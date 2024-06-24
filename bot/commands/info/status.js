import { } from "@discordjs/builders";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { eachSeries } from "async";
import { freemem, totalmem, cpus } from "os";
import osu from "node-os-utils";

export const name = "status";
export const descriptions = {
    en_US: "Shows bot's status.",
    ja: "Botのステータスを表示します。"
};
export const category = "info";
// export const aliases = []; //not recommended
export const commandType = "1"; //1: BaseCommand, 2: SubCommand, 3: SubCommandGroup
export const parentCommand = null;
export const parentGroup = null;
export const hide = false;
export const isNsfw = false;
export const slashOptions = [];
export const permissions = {
    internal: [],
    botNeededInChannel: 0n,
    botNeededInGuild: 0n,
    userNeeded: 0n,
}
export async function exec (cmd) {
    var language = cmd.info.language;//client.locale.getString("commands.help.title", language)
    await cmd.deferReply();
    var InternalPermissions = await cmd.author.getPermissions();
    var SecretButton = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('admin:registerDebugCommands').setLabel('Reg').setStyle(ButtonStyle.Primary)
    );
    var respMsg = {
        embeds: [{
            title: client.locale.getString("commands.status.title", language),
            color: config.colors.default_color,
            description:
                `**${client.locale.getString("commands.status.statistics.title", language)}**\n` + 
                `${client.locale.getString("commands.status.statistics.shardguilds", language)}: ${client.guilds.cache.size}\n` + 
                `${client.locale.getString("commands.status.statistics.totalguilds", language)}: ${client.guilds.count}\n` + 
                `${client.locale.getString("commands.status.statistics.shardusers", language)}: ${client.users.cache.size}\n` + 
                `${client.locale.getString("commands.status.statistics.totalshards", language)}: ${client.shardCount}\n\n` + 
                `**${client.locale.getString("commands.status.performance.title", language)}**\n` + 
                `${client.locale.getString("commands.status.performance.cpu", language)}: \`${cpus()[0].model}\` x${cpus().length} / ${await cpugetusage()}%\n` +
                `${client.locale.getString("commands.status.performance.ram", language)}: ${Math.round(((totalmem() - freemem()) / 1024 / 1024 / 1024) * 100) / 100}GB/${Math.round((totalmem() / 1024 / 1024 / 1024) * 100) / 100}GB (${Math.round((totalmem() - freemem()) / totalmem() * 1000) / 10}%)` +
                ``
        }]
    };
    if (InternalPermissions.has("Developer")) {
        respMsg["components"] = [SecretButton];
    }
    return await cmd.reply(respMsg);
    async function cpugetusage() {
        return await new Promise((resolve, reject) => {
            osu.cpu.usage()
                .then(info => {
                    resolve(info);
                })
        })
    }
    return await cmd.reply("done")
}