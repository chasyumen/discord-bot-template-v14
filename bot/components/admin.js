import { eachSeries } from "async";
import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import registerCommandOptions from "../../src/utils/registerCommandOptions.js";
import generateDescriptionArray from "../../src/utils/generateDescriptionArray.js";

export const name = "admin";
export const id = "admin";
export const hide = false;
export const type = 2; //BUTTON
export const permissions = {
    internal: ["Developer"],
    botNeededInChannel: 0n,
    botNeededInGuild: 0n,
    userNeeded: 0n,
}
export async function exec (cmd) {
    var language = cmd.info.language;
    var localCmd = cmd;
    await cmd.deferUpdate();
    await cmd.editReply({components: []});
    var regCmds = client.commands.filter(c => c.category == "dev");
    await cmd.followUp({content: "Registration in progress...", ephemeral: true});
    await eachSeries(regCmds.toJSON(), async (cmd, index) => {
        await new Promise(async (resolve, reject) => {
            // if (cmd.hide == true) return resolve(false);
            // if (cmd.guildCommand) return resolve(false);
            var command = client.application.commands.cache.find(x => x.name == cmd.name);
            // console.log(cmd.name);
            // if (typeof command == "object") {
            //     var descriptionParsed = `${cmd.descriptions.en_US} / ${cmd.descriptions.ja}`;
            //     if (descriptionParsed !== command.description) {
            //         set = true;
            //     } else if (cmd.slashOptions.options) {
            //         if (cmd.slashOptions.options.length !== command.options.length) {
            //             set = true;
            //         }
            //     } else if (!cmd.slashOptions.options && command.options.length >= 1) {
            //         set = true;
            //     }
            // } else {
            //     set = true;
            // }
            let descriptionArray = generateDescriptionArray(cmd.descriptions);
            let commandBuilder = new SlashCommandBuilder();
            commandBuilder
                .setName(cmd.name)
                .setDescription(cmd.descriptions[config.defaultLanguage]);
                //
            descriptionArray.forEach(loc => {
                commandBuilder.setDescriptionLocalization(loc.locale, loc.string);
            });

            // console.log(commandBuilder);
            // console.log(cmd.subCommands);
            cmd.subCommands.forEach((subCommand) => {
                if (subCommand.commandType == "2") {
                    var subCommandBuilder = new SlashCommandSubcommandBuilder();
                    // console.log(subCommand)
                    let subCommandDescriptionArray = generateDescriptionArray(cmd.descriptions);
                    subCommandBuilder
                        .setName(subCommand.name)
                        .setDescription(subCommand.descriptions[config.defaultLanguage]);
                    subCommandDescriptionArray.forEach(loc => {
                        subCommandBuilder.setDescriptionLocalization(loc.locale, loc.string);
                    });
                    subCommandBuilder = registerCommandOptions(subCommandBuilder, subCommand.slashOptions);
                    commandBuilder.addSubcommand(subCommandBuilder);
                } else if (subCommand.commandType == "3") {
                    var subCommandGroupBuilder = new SlashCommandSubcommandGroupBuilder();
                    let subCommandGroupDescriptionArray = generateDescriptionArray(cmd.descriptions);
                    subCommandGroupBuilder
                        .setName(subCommand.name)
                        .setDescription(subCommand.descriptions[config.defaultLanguage]);
                    subCommandGroupDescriptionArray.forEach(loc => {
                        subCommandGroupBuilder.setDescriptionLocalization(loc.locale, loc.string);
                    });
                    subCommand.subCommands.forEach((subCommand2) => {
                        if (subCommand2.commandType == "2") {
                            var subCommandBuilder = new SlashCommandSubcommandBuilder();
                            // console.log(subCommand)
                            let subCommandDescriptionArray = generateDescriptionArray(cmd.descriptions);
                            subCommandBuilder
                                .setName(subCommand2.name)
                                .setDescription(subCommand2.descriptions[config.defaultLanguage]);
                            subCommandDescriptionArray.forEach(loc => {
                                subCommandBuilder.setDescriptionLocalization(loc.locale, loc.string);
                            });
                            subCommandBuilder = registerCommandOptions(subCommandBuilder, subCommand2.slashOptions);
                            subCommandGroupBuilder.addSubcommand(subCommandBuilder);
                        }
                    });
                    commandBuilder.addSubcommandGroup(subCommandGroupBuilder);
                }
            });

            commandBuilder = registerCommandOptions(commandBuilder, cmd.slashOptions);

            //DMでの利用OK or NG
            commandBuilder.setDMPermission(cmd.dm);

            //デフォルト権限set up
            if (typeof cmd.permissions.userNeeded == "object") {
                var finalperm = 0n;
                cmd.permissions.userNeeded.forEach(perm => {
                    return finalperm = finalperm+perm;
                });
            } else {
                var finalperm = cmd.permissions.userNeeded;
            }
            if (finalperm == 0) {
                var finalperm = null;
            }
            commandBuilder.setDefaultMemberPermissions(finalperm);
            commandBuilder
            if (command) {
                if (command.guildId == localCmd.guild.id) {
                    await client.application.commands.edit(command, commandBuilder);
                } else {
                    await client.application.commands.create(commandBuilder, localCmd.guild.id);
                }
            } else {
                await client.application.commands.create(commandBuilder, localCmd.guild.id);
            }
            return setTimeout(() => {resolve(true)}, 2000)
        });
        return;
    });
    await cmd.followUp({content: "done", ephemeral: true});
}