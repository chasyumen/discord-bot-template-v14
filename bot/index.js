const Discord = (global.Discord = require("discord.js"));
const async2 = (global.async2 = require("async"));
const config = (global.config = require("../config.js"));
const Client = require("../src/structures/Client.js");
// const UserPermission = require("../src/structures/UserPermission.js");
const client = (global.client = new Client({
    intents: 3276799, //all intents / 3243773 no special intents
    allowedMentions: { repliedUser: false },
    presence: {
        status: "idle",
        activities: [
            { name: `Starting up... (1/2) | ${require("../package.json").version}` }//Starting | ${require("./../package.json").version}
        ]
    },
}));

Discord.TextChannel.prototype.fetchMessages = async function (number) {
    if (!this.isText()) return false;
    var messages = new Discord.Collection();
    async function fm(...opt) {
        return await this.messages.fetch(...opt);
    };

    while (messages.size < number) {
        var smallestId = null;
        if (messages.size >= 1) {
            messages.forEach(m => {
                if (!smallestId) {
                    smallestId = m.id;
                }
                if (smallestId > m.id) {
                    smallestId = m.id;
                }
            });
        }

        console.log(number - messages.size)
        var data = await fm({ limit: number - messages.size >= 101 ? 100 : number - messages.size, before: smallestId });
        data.forEach(m => messages.set(m.id, m))
    };
    return messages;
};

client.start(process.env.DISCORD_TOKEN);

process.on("uncaughtException", console.error);
process.on("unhandledRejection", console.error);