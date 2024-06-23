import { SlashCommandStringOption } from "@discordjs/builders";
import { PermissionFlagsBits } from "discord.js";
import { inspect } from "util";

export const name = "eval";
export const descriptions = {
    en_US: "only developers",
    ja: "開発者のみ"
};
export const category = "dev";
// export const aliases = []; //not recommended
export const commandType = "1"; //1: BaseCommand, 2: SubCommand, 3: SubCommandGroup
export const parentCommand = null;
export const parentGroup = null;
export const dm = false;
export const hide = false;
export const isNsfw = false;
export const slashOptions = [
    new SlashCommandStringOption().setName("code").setDescription("js code")
];
export const permissions = {
    internal: ["Developer"],
    botNeededInChannel: [PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel],
    botNeededInGuild: 0n,
    userNeeded: [],
}
export async function exec(cmd) {
    await cmd.deferReply();
    if (cmd.interaction.options.getString("code")) {
        try {
            const code = cmd.interaction.options.getString("code");//info.option.split("```")[1];
            let evaled = eval(code);

            if (typeof evaled !== "string") evaled = inspect(evaled);
            if (evaled == "") {
                evaled = null
            }
            if (evaled.length < 1992) {
                var msg = `\`\`\`xl\n${evaled}\`\`\``;
            } else {
                var msg = `\`\`\`xl\n${evaled.slice(0, 1961)} ... (More ${evaled.slice(1961).length} characters)\`\`\``;
            }
            var sentmsg = await cmd.reply({ embeds: [{ color: config.colors.default_color, description: msg }] });
            // if (message.guild.ownerId !== message.author.id) {
            //     // setTimeout(() => {
            //         // sentmsg.delete()
            //     // }, 10000);
            // }
            // i.user.send({ embeds: [{ color: config.colors.default_color, description: msg }] });
            return true;
        } catch (err) {
            // if (message.guild.ownerId == message.author.id) {
            var msg = await cmd.reply({
                embeds: [{
                    title: "Failed",
                    description: "Error:\n```xl\n" + inspect(err) + "```",
                    color: config.colors.error_color,
                    timestamp: new Date()
                }]
            });
            // }
            // if (message.guild.ownerId !== message.author.id) {
            // setTimeout(() => {
            // msg.delete()
            // }, 10000)
            // }
            // message.author.send({
            //     embeds: [{
            //         title: "Failed",
            //         description: "Error:\n```xl\n" + inspect(err) + "```",
            //         color: config.colors.error_color,
            //         timestamp: new Date()
            //     }]
            // });
            return true;
        }
    }
}