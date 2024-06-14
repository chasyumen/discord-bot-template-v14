export default function (commandBuilder, options) {
    options.forEach(option => {
        if (option.type == 3) {
            commandBuilder.addStringOption(option);
        } else if (option.type == 4) {
            commandBuilder.addIntegerOption(option);
        } else if (option.type == 5) {
            commandBuilder.addBooleanOption(option);
        } else if (option.type == 6) {
            commandBuilder.addUserOption(option);
        } else if (option.type == 7) {
            commandBuilder.addChannelOption(option);
        } else if (option.type == 8) {
            commandBuilder.addRoleOption(option);
        } else if (option.type == 9) {
            commandBuilder.addMentionableOption(option);
        } else if (option.type == 10) {
            commandBuilder.addNumberOption(option);
        } else if (option.type == 11) {
            commandBuilder.addAttachmentOption(option);
        }
    });
    return commandBuilder;
}