export const id = "errors";
export const language = "en_US";

export const data = {
    "errors": {
        "permissions": {
            "bot": {
                "missingEmbed": "EMBED_LINK permission is required but missing.",
                "any": "Bot doesn't have enough permissions to run this command!\n```!{permissions}```",
                "any_channel": "Bot doesn't have enough (channel) permissions to run this command!\n```!{permissions}```\n\nAlso detected that these permissions are assigned as guild permissions which might have been overridden by channel to be disabled. Please assign these permissions as channel permission.\n```!{permissions2}```",
                "any_channel2": "Bot doesn't have enough (channel) permissions to run this command!\n```!{permissions}```"
            },
            "user": {
                "any": "You don't have enough permissions to run this command!\n```!{permissions}```",
                "manageGuild": "You need manage guild permission to use that command.",
                "internalPermission": "Access to this command has been denied."
            }
        },
        "title": "Error",
        "unknown": "Unknown error has occurred."
    },
};