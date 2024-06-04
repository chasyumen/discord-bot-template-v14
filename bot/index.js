import * as Discord from "discord.js";
import async2 from "async";
import config from "../config.js";
import Client from "../src/structures/Client.js";
import UserPermission from "../src/structures/InternalPermissionsBitField.js";
import { readFileSync } from "fs";

global.async2 = async2;
global.Discord = Discord;
global.config = config;

const client = (global.client = new Client({
    intents: 3276799, //all intents / 3243773 no special intents
    allowedMentions: { repliedUser: false },
    presence: {
        status: "idle",
        activities: [
            { name: `Starting up... (1/2) | ${JSON.parse(readFileSync("./package.json").toString()).version}` }//Starting | ${require("./../package.json").version}
        ]
    },
}));

Discord.TextChannel.prototype.fetchMessages = async function (number) {
    if (!this.isText()) return false;
    var messages = new Collection();
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

Discord.User.prototype.getPermissions = async function () {
    var dbPerm = null;
    if (typeof config.userPermissions[this.id] == "number") {
        var configuredPermisson = String(config.userPermissions[this.id]);
    } else {
        var configuredPermisson = false;
    }
    var bitNumber = dbPerm || configuredPermisson;
    if (!bitNumber) {
        bitNumber = 0;
    }
    try {
        var UP = new UserPermission(Number(String(bitNumber)));
        return UP;
    } catch (error) {
        try {
            var UP = new UserPermission(Number(bitNumber));
            return UP;
        } catch (error) {
            throw error;
        }
    }
};

client.start(process.env.DISCORD_TOKEN);

process.on("uncaughtException", console.error);
process.on("unhandledRejection", console.error);