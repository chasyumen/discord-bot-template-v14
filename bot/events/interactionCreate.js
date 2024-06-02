export const name = "interactionCreate";
export const event = "interactionCreate";

export async function run (interaction) {
    if (interaction.user.id == client.user.id) return;
    if (!interaction.channel) return;
    if (!interaction.inGuild()) {
        return;
    }
    // var sData = await interaction.guild.getdb();
    // var uData = await interaction.user.getdb();
    if (!interaction.channel.type == "0") return;
    var language = config.defaultLanguage;//uData.language;
    // console.log(interaction.type);
    if (interaction.type == 2) {
        // if (!client.cooldowns.command.checkUser(interaction.user, interaction.commandName).state) return;
        // client.cooldowns.command.add(interaction.user, interaction.guild, interaction.commandName);
        if (!interaction.channel.permissionsFor((await interaction.guild.members.fetchMe())).has([BigInt(1 << 10), BigInt(1 << 11), BigInt(1 << 14)])) return await interaction.reply({ content: `<#${interaction.channel.id}> 内でBotがメッセージを閲覧する権限または(埋め込み)メッセージを送る権限がありません。`, ephemeral: true });
        // if (!interaction.channel.permissionsFor(interaction.guild.me).has(["EMBED_LINKS"])) return await interaction.reply(client.locale.getString("errors.permissions.bot.missingEmbed", language));
        var info = {
            command: interaction.commandName,
            options: interaction.options,
            isSlash: true,
            language: language,
            // serverData: sData,
            // userData: uData
        }
        // console.log(info);
        if (client.commands.has(info.command)) {
            var executor = client.commands.get(info.command).executor(interaction, info)
        } else if (client.commands.aliases.has(info.command)) {
            var executor = client.commands.get(client.commands.aliases.has(info.command)).executor(interaction, info)
        } else {
            return;
        }
        return executor.exec();
    } else if (interaction.type == 3) {
        if (!interaction.channel.permissionsFor((await interaction.guild.members.fetchMe())).has([BigInt(1 << 14)])) return await interaction.reply(client.locale.getString("errors.permissions.bot.missingEmbed", language));
        // console.log(interaction.customId);
        if (!(interaction.message.interaction || interaction.message.reference)) return false;
        if (interaction.message.reference) {
            try {
                var message = await interaction.channel.messages.fetch(interaction.message.reference.messageId);
                var uID = message.author.id;
            } catch (error) {
                var uID = null;
            }
        } else if (interaction.message.interaction) {
            var uID = interaction.message.interaction.user.id;
            // console.log("1", typeof interaction.message, interaction.message);
        } else {
            var uID = interaction.message.interaction.user.id;
            // console.log("2", typeof interaction.message, interaction.message);
        }
        var info = {
            command: interaction.customId.match(/:/) ? interaction.customId.split(":")[0] : interaction.customId,
            // option: message.content.slice(prefix.length).slice(message.content.slice(prefix.length).split(" ")[0].length+1),
            // options: interaction.options,
            // isSlash: true,
            language: uData.language,
            userId: uID
            // permission: await client.permissions.get(message.author.id),
            // serverData: sData,
            // channelData: await message.channel.getdb(),
            // userData: await message.author.getdb()
        }
        if (client.messagecomponents.has(info.command)) {
            var cmd = client.messagecomponents.get(info.command);
            if (cmd.type == interaction.component.type) {
                return await client.messagecomponents.run(info.command, interaction, info);
                // return await cmd.exec(interaction);
            } else {
                return interaction.reply({content: "Interaction Failed.", ephemeral: true});
            }
        } else {
            return interaction.reply({content: "Interaction Failed.", ephemeral: true});
        }
    }
    // console.log()
}