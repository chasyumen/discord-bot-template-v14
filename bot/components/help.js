export const name = "help";
export const id = "help";
export const hide = false;
export const type = 3; //SELECT_MENU
export const permissions = {
    internal: [],
    botNeededInChannel: 0n,
    botNeededInGuild: 0n,
    userNeeded: 0n,
}
export async function exec (cmd) {
    var language = cmd.info.language;
    if (cmd.info.userId) {
        if (cmd.interaction.user.id !== cmd.info.userId) {
            return await cmd.reply({ content: client.locale.getString(`components.help.otherUser`, language), ephemeral: true });
        }
    }
    var command = cmd.interaction.values[0];
    var deferUpdateSubcommands = ["home", "_showall"];
    if (deferUpdateSubcommands.includes(command) || command.startsWith("c:")) {
        await cmd.deferUpdate();
    // } else if (command.startsWith("c:")) {
        // await cmd.deferUpdate();
    } else {
        await cmd.deferReply({ ephemeral: true });
    };
    var commands = client.commands.toJSON();
    commands.sort(
        function (a, b) {
            var aName = a["name"];
            var bName = b["name"];
            if (aName < bName) return -1;
            if (aName > bName) return 1;
            return 0;
        }
    );
    await new Promise(resolve => setTimeout(resolve, 100));
    if (command == "home") {
        var categories_text = client.locale.getString("commands.help.text", language) + "\n";
        var categories = [];
        await async2.eachSeries(client.commands.toJSON().filter(x => !x.hide), async (cmd) => {
            if (!categories.find(x => x.id == cmd.category)) {
                if (!config.commandCategory[cmd.category]) {
                    var emoji = {"name": "🤖"};
                    var order = 0;
                } else {
                    var emoji = config.commandCategory[cmd.category].emoji;
                    var order = config.commandCategory[cmd.category].order;
                }
                var pushContent = { id: cmd.category, name: client.locale.getString(`commandcategory.${cmd.category}.title`, language), order: order, emoji: emoji, description: client.locale.getString(`commandcategory.${cmd.category}.description`, language) };
                categories.push(pushContent);
            }
        });
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
        await async2.eachSeries(categories, async (category) => {
            categories_text = `${categories_text}\n${category.emoji.name}/\`${category.name}\` | ${category.description}`
        });
        var embed = {
            title: client.locale.getString("commands.help.title", language),
            color: config.colors.default_color,
            description: categories_text
        };
        return await cmd.editReply({ embeds: [embed] });
    } else if (command == "_showall") {
        var text_1 = client.locale.getString("commands.help.showall.text", language) + "\n";
        var text_2 = commands.filter(x => !x.hide).map(x => { return ` \`${x.name}\``; }).toString().slice(1);
        var text = `${text_1}\n${text_2}`;
        // console.log(text);
        var embed = {
            title: client.locale.getString("commands.help.showall.title", language),
            color: config.colors.default_color,
            description: text
        };
        return await cmd.editReply({ embeds: [embed] });
    } else if (command.slice(0, 2) == "c:") {
        var cmdc = command.slice(2);
        var text_1 = "" + "\n";
        // await async2.eachSeries(client.commands.toJSON().filter(x => !x.hide).filter(x => x.category == cmdc), async (cmd) => {
        var text_2 = commands.filter(x => !x.hide).filter(x => x.category == cmdc).map(x => { return `\n\`${x.name}\`: ${x.descriptions[language]}`; }).toString().slice(1);
        var text = `${text_1}\n${text_2}`;
        // console.log(text);
        var embed = {
            title: client.locale.getString("commands.help.category.title", language).replace(/!{ct}/g, client.locale.getString(`commandcategory.${cmdc}.title`, language)),
            color: config.colors.default_color,
            description: text
        };
        return await cmd.editReply({ embeds: [embed] });
        // return await cmd.editReply({ content: `このコマンドは開発中です。\nカテゴリ: ${cmdc}`, ephemeral: true });
    } else {
        return; //await cmd.editReply({ content: ``, ephemeral: true });
    }
}