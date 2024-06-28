import { ApplicationCommandType, InteractionType } from "discord.js";

export const name = "interactionCreate";
export const event = "interactionCreate";
export const once = false;

export async function run(interaction) {
    if (interaction.user.id == client.user.id) return;
    if (!interaction.channel) return;
    if (!interaction.inGuild()) {
        return;
    }
    if (!client.allShardsReady) return;
    // var sData = await interaction.guild.getdb();
    var uData = await interaction.user.getdb();
    if (uData.language) language = uData.language;
    if (!interaction.channel.type == "0") return;
    var language = config.defaultLanguage;//uData.language;
    language = interaction.locale.replace(/-/g, "_");
    // console.log(interaction.type);
    if (interaction.type == InteractionType.ApplicationCommand) {
        if (interaction.commandType == ApplicationCommandType.ChatInput) {
            // console.log()
            // if (!client.cooldowns.command.checkUser(interaction.user, interaction.commandName).state) return;
            // client.cooldowns.command.add(interaction.user, interaction.guild, interaction.commandName);
            // if (!interaction.channel.permissionsFor((await interaction.guild.members.fetchMe())).has([BigInt(1 << 10), BigInt(1 << 11), BigInt(1 << 14)])) return await interaction.reply({ content: `<#${interaction.channel.id}> 内でBotがメッセージを閲覧する権限または(埋め込み)メッセージを送る権限がありません。`, ephemeral: true });
            // if (!interaction.channel.permissionsFor(interaction.guild.me).has(["EMBED_LINKS"])) return await interaction.reply(client.locale.getString("errors.permissions.bot.missingEmbed", language));
            var info = {
                command: interaction.commandName,
                options: interaction.options,
                isSlash: true,
                language: language,
                // serverData: sData,
                userData: uData
            }
            // console.log(info);
            if (client.commands.has(info.command)) {
                var command = client.commands.get(info.command);
            } else if (client.commands.aliases.has(info.command)) {
                var command = client.commands.get(client.commands.aliases.has(info.command));
            } else {
                return;
            }
            if (command.subCommands.size == 0) {
                var executor = command.executor(interaction, info);
            } else {
                var subCommandGroupId = interaction.options.getSubcommandGroup(false);
                if (subCommandGroupId) {
                    var subCommandId = interaction.options.getSubcommand();
                    var subCommand = command.subCommands.get(subCommandGroupId).subCommands.get(subCommandId);
                } else {
                    var subCommandId = interaction.options.getSubcommand();
                    var subCommand = command.subCommands.get(subCommandId);
                }

                var executor = subCommand.executor(interaction, info);
                // var executor = command.executor(interaction, info);
            }
            return executor.exec();
        } else if (
            interaction.commandType == ApplicationCommandType.Message ||
            interaction.commandType == ApplicationCommandType.User
        ) {
            var info = {
                command: interaction.commandName,
                language: language,
                // serverData: sData,
                userData: uData
            }
            // console.log(interaction)
            if (client.contextMenus.has(info.command)) {
                var command = client.contextMenus.get(info.command);
            } else {
                return;
            }
            var executor = command.executor(interaction, info);
            return executor.exec();
        }

    } else if (interaction.type == InteractionType.MessageComponent) {
        // language = interaction.locale;
        // return;
        // if (!interaction.channel.permissionsFor((await interaction.guild.members.fetchMe())).has([BigInt(1 << 14)])) return await interaction.reply(client.locale.getString("errors.permissions.bot.missingEmbed", language));
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
            subCommand: interaction.customId.match(/:/) ? interaction.customId.split(":")[1] : null,
            options: interaction.options,
            language: language,
            userId: uID,
            // permission: await client.permissions.get(message.author.id),
            // serverData: sData,
            // channelData: await message.channel.getdb(),
            userData: uData
        }
        if (client.messageComponents.has(info.command)) {
            var cmd = client.messageComponents.get(info.command);
            if (cmd.type == interaction.component.type) {
                var executor = cmd.executor(interaction, info);
                // return await cmd.exec(interaction);
                return executor.exec();
            } else {
                return interaction.reply({ content: "Interaction Failed.", ephemeral: true });
            }
        } else {
            return interaction.reply({ content: "Interaction Failed.", ephemeral: true });
        }
    }
    // console.log()
}