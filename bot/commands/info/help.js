import { SlashCommandStringOption, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "@discordjs/builders";
import { ActionRowBuilder } from "discord.js";
import { eachSeries } from "async";

export const name = "help";
export const descriptions = {
    en_US: "Shows list commands",
    ja: "コマンド一覧を表示します。"
};
export const category = "info";
// export const aliases = []; //not recommended
export const commandType = "1"; //1: BaseCommand, 2: SubCommand, 3: SubCommandGroup
export const parentCommand = null;
export const parentGroup = null;
export const hide = false;
export const isNsfw = false;
export const slashOptions = [
    new SlashCommandStringOption().setName("command").setDescription("Command"),
];
export const permissions = {
    internal: [],
    botNeededInChannel: 0n,
    botNeededInGuild: 0n,
    userNeeded: 0n,
}
export async function exec (cmd) {
    var language = cmd.info.language;//client.locale.getString("commands.help.title", language)
    await cmd.deferReply();
    if (cmd.isSlash ? cmd.info.options.getString("command") : cmd.info.option) {
        var command = cmd.isSlash ? cmd.info.options.getString("command") : cmd.info.option;
    } else {
        var command = false;
    }

    if (command == false) {
        var categories_text = client.locale.getString("commands.help.text", language) + "\n";
        var categories = [];
        var SelectMenuOptions = [];
        SelectMenuOptions.push({ label: client.locale.getString("commands.help.options.home", language), value: "home" });
        SelectMenuOptions.push({ label: client.locale.getString("commands.help.options.showall", language), value: "_showall", emoji: {name: "🤖"} });
        await eachSeries(client.commands.toJSON().filter(x => !x.hide), async (cmd) => {
            if (!categories.find(x => x.id == cmd.category)) {
                if (!config.commandCategory[cmd.category]) {
                    var emoji = {name: "🤖"};
                    var order = 0;
                } else {
                    var emoji = config.commandCategory[cmd.category].emoji;
                    var order = config.commandCategory[cmd.category].order;
                }
                var pushContent = { id: cmd.category, name: client.locale.getString(`commandcategory.${cmd.category}.title`, language), order: order, emoji: emoji, description: client.locale.getString(`commandcategory.${cmd.category}.description`, language) };
                categories.push(pushContent);
            }
        });
        // console.log(categories);
        categories.sort(
            function (a, b) {
                var aName = a["order"];
                var bName = b["order"];
                if (aName < bName) return 1;
                if (aName > bName) return -1;
                return 0;
            }
        );
        await new Promise(resolve => setTimeout(resolve, 100));
        // console.log(categories);
        await eachSeries(categories, async (category) => {
            categories_text = `${categories_text}\n${category.emoji.name}/\`${category.name}\` | ${category.description}`;
            var Builder = new StringSelectMenuOptionBuilder().setLabel(category.name).setValue(`c:${category.id}`).setDescription(category.description).setEmoji(category.emoji);
            SelectMenuOptions.push(Builder);
        });
        var embed = {
            title: client.locale.getString("commands.help.title", language),
            color: config.colors.default_color,
            description: categories_text
        };
        // console.log(SelectMenuOptions);
        var SelectMenu = new StringSelectMenuBuilder().setCustomId("help").setMaxValues(1).addOptions(...SelectMenuOptions);
        var FinalComponent = new ActionRowBuilder().addComponents(SelectMenu);
        return await cmd.reply({
            embeds: [embed],
            components: [FinalComponent]
        });
    } else {
        if (client.commands.has(command)) {
            var commandInfo = client.commands.get(command);
            var embed = {
                title: command + client.locale.getString("commands.help.command.title", language),
                color: config.colors.default_color,
                description: commandInfo.description[language],
                footer: {
                    text: `aliases:${commandInfo.aliases.map(x => ` ${x}`)}`
                }
            };
            return await cmd.reply({
                embeds: [embed],
            });
        } else {
            return await cmd.reply({ content: client.locale.getString("commands.help.command.errors.not_found", language), ephemeral: true });
        }
    }
}